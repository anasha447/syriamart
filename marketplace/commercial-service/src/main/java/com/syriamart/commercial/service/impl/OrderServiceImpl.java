package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.order.CheckoutRequest;
import com.syriamart.commercial.dto.request.order.OrderUpdateStatusRequest;
import com.syriamart.commercial.dto.response.order.*;
import com.syriamart.commercial.mapper.OrderItemMapper;
import com.syriamart.commercial.mapper.OrderMapper;
import com.syriamart.commercial.model.*;
import com.syriamart.commercial.model.enums.OrderItemStatus;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.OrderService;
import com.syriamart.common.event.*;
import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.common.model.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository              orderRepo;
    private final OrderItemRepository          orderItemRepo;
    private final CartRepository               cartRepo;
    private final CartItemRepository           cartItemRepo;
    private final ProductRepository            productRepo;
    private final ProductVariationValueRepository pvvRepo;
    private final CouponRepository             couponRepo;
    private final OrderMapper                  orderMapper;
    private final OrderItemMapper              orderItemMapper;
    private final ApplicationEventPublisher    eventPublisher;

    // ─────────────────────────────────────────────────────────────────────────
    // CHECKOUT — the critical transactional path
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CheckoutSummaryResponse checkout(String customerId, CheckoutRequest req) {

        // 1. Retrieve & validate cart
        Cart cart = cartRepo.findByCustomerId(customerId)
                .orElseThrow(() -> new IllegalStateException("Your cart is empty."));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Your cart is empty.");
        }

        // 2. Build order shell
        Order order = Order.builder()
                .customerId(customerId)
                .status(OrderStatus.PENDING)
                .shippingFullName(req.shippingFullName())
                .shippingPhone(req.shippingPhone())
                .shippingAddressLine1(req.deliveryAddressLine1())
                .shippingAddressLine2(req.deliveryAddressLine2())
                .shippingCity(req.shippingCity())
                .shippingGovernorate(req.shippingGovernorate())
                .notes(req.notes())
                .shippingFee(BigDecimal.valueOf(5)) // flat rate — replace with logistics quote
                .build();

        // 3. Process each cart item → order line + stock decrement
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemEventData> eventItems = new ArrayList<>();

        for (CartItem ci : cart.getItems()) {
            Product product = productRepo.findById(ci.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", ci.getProductId()));

            // Re-validate price at checkout time
            BigDecimal unitPrice = resolvePrice(product, ci.getVariationValueId());
            int available        = resolveStock(product, ci.getVariationValueId());

            if (ci.getQuantity() > available) {
                throw new IllegalStateException(
                        "Insufficient stock for: " + product.getName() +
                        ". Available: " + available);
            }

            // Decrement stock (optimistic lock via specific query)
            decrementStock(product, ci.getVariationValueId(), ci.getQuantity());

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            String variationSnapshot = buildVariationSummary(ci.getVariationValueId());
            String imageUrl = product.getImages().stream()
                    .filter(ProductImage::isPrimary).map(ProductImage::getUrl)
                    .findFirst().orElse(null);

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .sellerId(product.getSellerId())
                    .variationValueId(ci.getVariationValueId())
                    .productNameSnapshot(product.getName())
                    .variationSnapshot(variationSnapshot)
                    .imageUrlSnapshot(imageUrl)
                    .unitPrice(unitPrice)
                    .quantity(ci.getQuantity())
                    .status(OrderItemStatus.PENDING)
                    .build();
            item.computeLineTotal();
            orderItems.add(item);
            order.getItems().add(item);

            eventItems.add(new OrderItemEventData(
                    product.getId(),
                    product.getName(), // Replaced sellerId with productName to match common-lib
                    ci.getQuantity(),
                    unitPrice));
        }

        // 4. Apply coupon
        BigDecimal discount = BigDecimal.ZERO;
        String appliedCode  = req.couponCode();
        if (appliedCode != null && !appliedCode.isBlank()) {
            Coupon coupon = couponRepo.findByCodeIgnoreCase(appliedCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon", appliedCode));
            if (!coupon.isValid()) throw new IllegalStateException("Coupon is expired or invalid.");
            discount = coupon.computeDiscount(subtotal);
            order.setCouponCode(coupon.getCode());
            couponRepo.incrementUsage(coupon.getCode());
        }

        // 5. Finalize totals
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discount);
        order.recalculateTotal();

        Order saved = orderRepo.save(order);

        // 6. Clear cart
        cart.getItems().clear();
        cart.setAppliedCouponCode(null);
        cartRepo.save(cart);

        // 7. Publish domain event for logistics-service
        // 7. Publish domain event for logistics-service matching the 12 arguments
        String primarySellerId = orderItems.isEmpty() ? "UNKNOWN" : orderItems.get(0).getSellerId();

        eventPublisher.publishEvent(new OrderCreatedEvent(
                saved.getId(),                    // 1. orderId
                customerId,                       // 2. customerId
                primarySellerId,                  // 3. sellerId
                null,                             // 4. qrId (logistics will generate this later)
                saved.getTotal(),                 // 5. totalAmount
                req.deliveryAddressLine1(),       // 6. deliveryAddressLine1
                req.shippingCity(),               // 7. deliveryCity
                req.shippingGovernorate(),        // 8. deliveryState (using governorate)
                "000000",                         // 9. deliveryPostalCode (placeholder)
                eventItems,                       // 10. items
                java.time.LocalDateTime.now(),    // 11. createdAt
                java.time.LocalDateTime.now().plusDays(5) // 12. expectedDelivery
        ));

        return new CheckoutSummaryResponse(
                saved.getId(),
                orderItemMapper.toResponseList(saved.getItems()),
                subtotal, discount, saved.getShippingFee(), saved.getTotal(),
                appliedCode, "Order placed successfully.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CUSTOMER READ
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse findByIdForCustomer(String orderId, String customerId) {
        Order order = orderRepo.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return orderMapper.toDetail(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderListResponse> findMyOrders(String customerId, Pageable pageable) {
        return orderRepo.findByCustomerId(customerId, pageable)
                .getContent().stream()
                .map(orderMapper::toListResponse)
                .toList();
    }

    @Override
    public void cancelOrder(String orderId, String customerId) {
        Order order = orderRepo.findByIdAndCustomerId(orderId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Only PENDING orders can be cancelled by the customer.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.getItems().forEach(i -> {
            i.setStatus(OrderItemStatus.CANCELLED);
            restoreStock(i);
        });

        orderRepo.save(order);
        eventPublisher.publishEvent(new OrderCancelledEvent(
                orderId,
                "Cancelled by customer request", // reason
                "customer",                      // cancelledBy
                java.time.LocalDateTime.now()    // cancelledAt
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SELLER OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderSellerViewResponse> findOrdersForSeller(String sellerId, Pageable pageable) {
        Page<OrderItem> page = orderItemRepo.findBySellerId(sellerId, pageable);

        // Group items by orderId for multi-item seller views
        Map<String, List<OrderItem>> grouped = page.getContent().stream()
                .collect(Collectors.groupingBy(i -> i.getOrder().getId()));

        return grouped.entrySet().stream().map(entry -> {
            List<OrderItem> items = entry.getValue();
            Order order   = items.get(0).getOrder();
            BigDecimal sub = items.stream()
                    .map(OrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            OrderItemStatus aggStatus = items.stream()
                    .map(OrderItem::getStatus)
                    .min(Comparator.comparingInt(OrderItemStatus::ordinal))
                    .orElse(OrderItemStatus.PENDING);

            return new OrderSellerViewResponse(
                    order.getId(), order.getCustomerId(),
                    order.getShippingFullName(), order.getShippingPhone(),
                    order.getShippingCity(), order.getShippingGovernorate(),
                    orderItemMapper.toResponseList(items),
                    sub, aggStatus, order.getCreatedAt());
        }).toList();
    }

    @Override
    public OrderStatusEventResponse updateItemStatus(String orderItemId, String sellerId,
                                                     OrderUpdateStatusRequest req) {
        OrderItem item = orderItemRepo.findByIdAndSellerId(orderItemId, sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", orderItemId));

        validateTransition(item.getStatus(), req.status());
        item.setStatus(req.status());
        if (req.sellerNote() != null) item.setSellerNote(req.sellerNote());
        orderItemRepo.save(item);

        // Sync parent order status
        syncOrderStatus(item.getOrder());

        return new OrderStatusEventResponse(
                orderItemId, req.status(), req.sellerNote(), item.getUpdatedAt());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderListResponse> findAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> page = (status != null)
                ? orderRepo.findByStatus(status, pageable)
                : orderRepo.findAll(pageable);
        return page.getContent().stream().map(orderMapper::toListResponse).toList();
    }

    @Override
    public void adminUpdateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(status);
        orderRepo.save(order);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CALLED BY LOGISTICS-SERVICE EVENTS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void markOrderShipped(String orderId, String trackingNumber) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(OrderStatus.SHIPPED);
        order.setTrackingNumber(trackingNumber);
        order.getItems().stream()
                .filter(i -> i.getStatus() == OrderItemStatus.PROCESSING
                          || i.getStatus() == OrderItemStatus.CONFIRMED)
                .forEach(i -> i.setStatus(OrderItemStatus.SHIPPED));
        orderRepo.save(order);
    }

    @Override
    public void markOrderDelivered(String orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(OrderStatus.DELIVERED);
        order.getItems().stream()
                .filter(i -> i.getStatus() == OrderItemStatus.SHIPPED)
                .forEach(i -> {
                    i.setStatus(OrderItemStatus.DELIVERED);
                    // Increment product's totalSold counter
                    productRepo.findById(i.getProductId()).ifPresent(p -> {
                        p.setTotalSold(p.getTotalSold() + i.getQuantity());
                        productRepo.save(p);
                    });
                });
        orderRepo.save(order);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /** Allowed seller-driven transitions. */
    private static final Map<OrderItemStatus, Set<OrderItemStatus>> ALLOWED_TRANSITIONS = Map.of(
            OrderItemStatus.PENDING,    Set.of(OrderItemStatus.CONFIRMED, OrderItemStatus.CANCELLED),
            OrderItemStatus.CONFIRMED,  Set.of(OrderItemStatus.PROCESSING, OrderItemStatus.CANCELLED),
            OrderItemStatus.PROCESSING, Set.of(OrderItemStatus.SHIPPED)
    );

    private void validateTransition(OrderItemStatus current, OrderItemStatus next) {
        Set<OrderItemStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new IllegalStateException(
                    "Cannot transition from " + current + " to " + next);
        }
    }

    /**
     * After any item transition, re-evaluate the parent order's aggregate status.
     * The order is considered COMPLETED only when ALL items are delivered.
     * It is PROCESSING when at least one item is being processed.
     */
    private void syncOrderStatus(Order order) {
        List<OrderItemStatus> statuses = order.getItems().stream()
                .map(OrderItem::getStatus).distinct().toList();

        if (statuses.stream().allMatch(s -> s == OrderItemStatus.DELIVERED)) {
            order.setStatus(OrderStatus.DELIVERED);
        } else if (statuses.contains(OrderItemStatus.SHIPPED)) {
            order.setStatus(OrderStatus.SHIPPED);
        } else if (statuses.contains(OrderItemStatus.PROCESSING)
                || statuses.contains(OrderItemStatus.CONFIRMED)) {
            order.setStatus(OrderStatus.CONFIRMED);
        }
        orderRepo.save(order);
    }

    private BigDecimal resolvePrice(Product product, String variationValueId) {
        if (variationValueId == null) return product.getBasePrice();
        return pvvRepo.findById(variationValueId)
                .map(pvv -> pvv.effectivePrice(product.getBasePrice()))
                .orElse(product.getBasePrice());
    }

    private int resolveStock(Product product, String variationValueId) {
        if (variationValueId == null) return product.getStockQuantity();
        return pvvRepo.findById(variationValueId)
                .map(ProductVariationValue::getStockQuantity)
                .orElse(0);
    }

    private void decrementStock(Product product, String variationValueId, int qty) {
        if (variationValueId != null) {
            int updated = pvvRepo.decrementStock(variationValueId, qty);
            if (updated == 0) throw new IllegalStateException("Stock update failed — possible concurrency issue.");
        } else {
            if (product.getStockQuantity() < qty) {
                throw new IllegalStateException("Insufficient stock for " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - qty);
            productRepo.save(product);
        }
    }

    private void restoreStock(OrderItem item) {
        if (item.getVariationValueId() != null) {
            pvvRepo.incrementStock(item.getVariationValueId(), item.getQuantity());
        } else {
            productRepo.findById(item.getProductId()).ifPresent(p -> {
                p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
                productRepo.save(p);
            });
        }
    }

    private String buildVariationSummary(String variationValueId) {
        if (variationValueId == null) return null;
        return pvvRepo.findById(variationValueId)
                .map(pvv -> pvv.getSelectedOptions().stream()
                        .map(opt -> opt.getVariation().getName() + ": " + opt.getValue())
                        .reduce((a, b) -> a + ", " + b).orElse(null))
                .orElse(null);
    }
}
