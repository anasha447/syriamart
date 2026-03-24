package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.order.CheckoutRequest;
import com.syriamart.commercial.dto.request.order.OrderUpdateStatusRequest;
import com.syriamart.commercial.dto.response.order.*;
import com.syriamart.common.model.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    CheckoutSummaryResponse checkout(String customerId, CheckoutRequest request);
    OrderDetailResponse findByIdForCustomer(String orderId, String customerId);
    List<OrderListResponse> findMyOrders(String customerId, Pageable pageable);
    void cancelOrder(String orderId, String customerId);

    // Seller operations
    List<OrderSellerViewResponse> findOrdersForSeller(String sellerId, Pageable pageable);
    OrderStatusEventResponse updateItemStatus(String orderItemId, String sellerId, OrderUpdateStatusRequest request);

    // Admin operations
    List<OrderListResponse> findAllOrders(OrderStatus status, Pageable pageable);
    void adminUpdateOrderStatus(String orderId, OrderStatus status);

    // Called by logistics-service via event
    void markOrderShipped(String orderId, String trackingNumber);
    void markOrderDelivered(String orderId);
}
