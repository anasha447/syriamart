package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.wishlist.WishlistAddItemRequest;
import com.syriamart.commercial.dto.request.wishlist.WishlistCreateRequest;
import com.syriamart.commercial.dto.response.wishlist.WishlistResponse;

import java.util.List;

public interface WishlistService {
    WishlistResponse getOrCreateDefault(String customerId);
    WishlistResponse createWishlist(String customerId, WishlistCreateRequest request);
    List<WishlistResponse> getMyWishlists(String customerId);
    WishlistResponse addItem(String customerId, String wishlistId, WishlistAddItemRequest request);
    WishlistResponse removeItem(String customerId, String wishlistId, String productId);
    void deleteWishlist(String customerId, String wishlistId);
    void moveToCart(String customerId, String wishlistId);
}
