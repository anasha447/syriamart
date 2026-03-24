package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.cart.CartAddItemRequest;
import com.syriamart.commercial.dto.request.wishlist.WishlistAddItemRequest;
import com.syriamart.commercial.dto.request.wishlist.WishlistCreateRequest;
import com.syriamart.commercial.dto.response.product.ProductSummaryResponse;
import com.syriamart.commercial.dto.response.wishlist.WishlistItemResponse;
import com.syriamart.commercial.dto.response.wishlist.WishlistResponse;
import com.syriamart.commercial.mapper.ProductMapper;
import com.syriamart.commercial.model.*;
import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.CartService;
import com.syriamart.commercial.service.WishlistService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository     wishlistRepo;
    private final WishlistItemRepository wishlistItemRepo;
    private final ProductRepository      productRepo;
    private final CartService            cartService;
    private final ProductMapper          productMapper;

    @Override
    public WishlistResponse getOrCreateDefault(String customerId) {
        Wishlist wishlist = wishlistRepo.findByCustomerIdAndDefaultListTrue(customerId)
                .orElseGet(() -> wishlistRepo.save(
                        Wishlist.builder().customerId(customerId).build()));
        return toResponse(wishlist);
    }

    @Override
    public WishlistResponse createWishlist(String customerId, WishlistCreateRequest req) {
        Wishlist wishlist = Wishlist.builder()
                .customerId(customerId)
                .name(req.name())
                .defaultList(false)
                .build();
        return toResponse(wishlistRepo.save(wishlist));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getMyWishlists(String customerId) {
        return wishlistRepo.findByCustomerId(customerId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public WishlistResponse addItem(String customerId, String wishlistId,
                                    WishlistAddItemRequest req) {
        Wishlist wishlist = getOwned(customerId, wishlistId);
        if (wishlistItemRepo.existsByWishlistIdAndProductId(wishlistId, req.productId())) {
            return toResponse(wishlist); // idempotent — already there
        }
        if (!productRepo.existsById(req.productId())) {
            throw new ResourceNotFoundException("Product", req.productId());
        }
        WishlistItem item = WishlistItem.builder()
                .wishlist(wishlist)
                .productId(req.productId())
                .build();
        wishlist.getItems().add(item);
        return toResponse(wishlistRepo.save(wishlist));
    }

    @Override
    public WishlistResponse removeItem(String customerId, String wishlistId, String productId) {
        Wishlist wishlist = getOwned(customerId, wishlistId);
        wishlistItemRepo.deleteByWishlistIdAndProductId(wishlistId, productId);
        return toResponse(wishlistRepo.save(wishlist));
    }

    @Override
    public void deleteWishlist(String customerId, String wishlistId) {
        Wishlist wishlist = getOwned(customerId, wishlistId);
        if (wishlist.isDefaultList()) {
            throw new IllegalStateException("Cannot delete the default wishlist.");
        }
        wishlistRepo.delete(wishlist);
    }

    /** Moves all in-stock wishlist items to the customer's cart and clears the wishlist. */
    @Override
    public void moveToCart(String customerId, String wishlistId) {
        Wishlist wishlist = getOwned(customerId, wishlistId);
        wishlist.getItems().forEach(item -> {
            productRepo.findById(item.getProductId()).ifPresent(p -> {
                if (p.getStatus() == ProductStatus.ACTIVE && p.getStockQuantity() > 0) {
                    cartService.addItem(customerId,
                            new CartAddItemRequest(p.getId(), null, 1));
                }
            });
        });
        wishlist.getItems().clear();
        wishlistRepo.save(wishlist);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Wishlist getOwned(String customerId, String wishlistId) {
        return wishlistRepo.findByIdAndCustomerId(wishlistId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", wishlistId));
    }

    private WishlistResponse toResponse(Wishlist wishlist) {
        List<WishlistItemResponse> items = wishlist.getItems().stream().map(wi -> {
            Product product = productRepo.findById(wi.getProductId()).orElse(null);
            ProductSummaryResponse summary = product != null
                    ? productMapper.toSummary(product, product.getBasePrice())
                    : null;
            return new WishlistItemResponse(wi.getId(), summary, wi.getCreatedAt());
        }).toList();
        return new WishlistResponse(
                wishlist.getId(), wishlist.getName(), wishlist.isDefaultList(), items);
    }
}
