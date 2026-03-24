package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.cart.CartAddItemRequest;
import com.syriamart.commercial.dto.request.cart.CartUpdateItemRequest;
import com.syriamart.commercial.dto.response.cart.CartResponse;

public interface CartService {
    CartResponse getOrCreateCart(String customerId);
    CartResponse addItem(String customerId, CartAddItemRequest request);
    CartResponse updateItem(String customerId, String cartItemId, CartUpdateItemRequest request);
    CartResponse removeItem(String customerId, String cartItemId);
    CartResponse applyCoupon(String customerId, String couponCode);
    CartResponse removeCoupon(String customerId);
    void clearCart(String customerId);
}
