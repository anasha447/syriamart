package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.cart.CartAddItemRequest;
import com.syriamart.commercial.dto.request.cart.CartUpdateItemRequest;
import com.syriamart.commercial.dto.response.cart.CartItemResponse;
import com.syriamart.commercial.dto.response.cart.CartResponse;
import com.syriamart.commercial.model.*;
import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.CartService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository              cartRepo;
    private final CartItemRepository          cartItemRepo;
    private final ProductRepository           productRepo;
    private final ProductVariationValueRepository pvvRepo;
    private final CouponRepository            couponRepo;

    // ─────────────────────────────────────────────────────────────────────────
    // GET OR CREATE
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CartResponse getOrCreateCart(String customerId) {
        Cart cart = cartRepo.findByCustomerId(customerId)
                .orElseGet(() -> cartRepo.save(
                        Cart.builder().customerId(customerId).build()));
        return buildResponse(cart);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADD ITEM
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CartResponse addItem(String customerId, CartAddItemRequest req) {
        Cart cart = getOrCreateEntity(customerId);

        Product product = productRepo.findById(req.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", req.productId()));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new IllegalStateException("Product is not available for purchase.");
        }

        BigDecimal unitPrice = resolvePrice(product, req.variationValueId());
        int availableStock   = resolveStock(product, req.variationValueId());

        if (req.quantity() > availableStock) {
            throw new IllegalStateException("Requested quantity exceeds available stock (" + availableStock + ").");
        }

        // Merge with existing cart line if same product + variation
        Optional<CartItem> existing = cartItemRepo
                .findByCartIdAndProductIdAndVariationValueId(
                        cart.getId(), req.productId(), req.variationValueId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty    = item.getQuantity() + req.quantity();
            if (newQty > availableStock) {
                throw new IllegalStateException("Total quantity would exceed stock.");
            }
            item.setQuantity(newQty);
            item.setUnitPrice(unitPrice); // refresh price in case it changed
            cartItemRepo.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .productId(req.productId())
                    .variationValueId(req.variationValueId())
                    .quantity(req.quantity())
                    .unitPrice(unitPrice)
                    .build();
            cart.getItems().add(item);
        }

        return buildResponse(cartRepo.save(cart));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE ITEM QUANTITY
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CartResponse updateItem(String customerId, String cartItemId, CartUpdateItemRequest req) {
        Cart cart     = getOrCreateEntity(customerId);
        CartItem item = getOwnedItem(cart, cartItemId);

        if (req.quantity() == 0) {
            cart.getItems().remove(item);
            cartItemRepo.delete(item);
        } else {
            int stock = resolveStock(
                    productRepo.findById(item.getProductId()).orElseThrow(),
                    item.getVariationValueId());
            if (req.quantity() > stock) {
                throw new IllegalStateException("Quantity exceeds available stock.");
            }
            item.setQuantity(req.quantity());
            cartItemRepo.save(item);
        }

        return buildResponse(cartRepo.save(cart));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REMOVE ITEM
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CartResponse removeItem(String customerId, String cartItemId) {
        Cart cart     = getOrCreateEntity(customerId);
        CartItem item = getOwnedItem(cart, cartItemId);
        cart.getItems().remove(item);
        cartItemRepo.delete(item);
        return buildResponse(cartRepo.save(cart));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COUPON
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CartResponse applyCoupon(String customerId, String couponCode) {
        Cart cart = getOrCreateEntity(customerId);
        Coupon coupon = couponRepo.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", couponCode));
        if (!coupon.isValid()) {
            throw new IllegalStateException("Coupon is expired, inactive, or exhausted.");
        }
        cart.setAppliedCouponCode(coupon.getCode());
        return buildResponse(cartRepo.save(cart));
    }

    @Override
    public CartResponse removeCoupon(String customerId) {
        Cart cart = getOrCreateEntity(customerId);
        cart.setAppliedCouponCode(null);
        return buildResponse(cartRepo.save(cart));
    }

    @Override
    public void clearCart(String customerId) {
        cartRepo.findByCustomerId(customerId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setAppliedCouponCode(null);
            cartRepo.save(cart);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RESPONSE BUILDER
    // ─────────────────────────────────────────────────────────────────────────

    private CartResponse buildResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        if (cart.getAppliedCouponCode() != null) {
            discount = couponRepo.findByCodeIgnoreCase(cart.getAppliedCouponCode())
                    .filter(Coupon::isValid)
                    .map(c -> c.computeDiscount(subtotal))
                    .orElse(BigDecimal.ZERO);
        }

        BigDecimal estimated = subtotal.subtract(discount);

        return new CartResponse(
                cart.getId(), cart.getCustomerId(),
                itemResponses, subtotal,
                cart.getAppliedCouponCode(), discount, estimated);
    }

    private CartItemResponse toItemResponse(CartItem item) {
        Product product    = productRepo.findById(item.getProductId()).orElse(null);
        String  name       = product != null ? product.getName() : "Unknown";
        String  imageUrl   = product != null
                ? product.getImages().stream().filter(ProductImage::isPrimary)
                          .map(ProductImage::getUrl).findFirst().orElse(null)
                : null;
        boolean inStock    = product != null && resolveStock(product, item.getVariationValueId()) >= item.getQuantity();
        BigDecimal total   = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartItemResponse(
                item.getId(), item.getProductId(), name,
                item.getVariationValueId(),
                buildVariationSummary(item.getVariationValueId()),
                imageUrl, item.getUnitPrice(), item.getQuantity(), total, inStock);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private Cart getOrCreateEntity(String customerId) {
        return cartRepo.findByCustomerId(customerId)
                .orElseGet(() -> cartRepo.save(
                        Cart.builder().customerId(customerId).build()));
    }

    private CartItem getOwnedItem(Cart cart, String cartItemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", cartItemId));
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

    private String buildVariationSummary(String variationValueId) {
        if (variationValueId == null) return null;
        return pvvRepo.findById(variationValueId)
                .map(pvv -> pvv.getSelectedOptions().stream()
                        .map(opt -> opt.getVariation().getName() + ": " + opt.getValue())
                        .reduce((a, b) -> a + ", " + b)
                        .orElse(null))
                .orElse(null);
    }
}
