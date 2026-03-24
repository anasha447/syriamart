package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.product.*;
import com.syriamart.commercial.dto.response.product.*;

import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDetailResponse createProduct(String sellerId, ProductCreateRequest request);
    ProductDetailResponse updateProduct(String productId, String sellerId, ProductUpdateRequest request);
    void deleteProduct(String productId, String sellerId);

    ProductDetailResponse addImages(String productId, String sellerId, java.util.List<ProductImageRequest> requests);
    void removeImage(String productId, String imageId, String sellerId);

    ProductDetailResponse setVariations(String productId, String sellerId, java.util.List<ProductVariationRequest> requests);

    ProductDetailResponse findById(String productId);
    ProductDetailResponse findBySlug(String slug);
    ProductListResponse findBySeller(String sellerId, Pageable pageable);
    ProductCatalogResponse findByCategory(String categoryId, Pageable pageable);
    ProductCatalogResponse findBySubCategory(String subCategoryId, Pageable pageable);
    ProductSearchResponse search(String query, Pageable pageable);
    ProductListResponse findTopSelling(int limit);
    ProductListResponse findTopRated(int limit);

    // Admin moderation
    ProductDetailResponse moderate(String productId, ProductModerationRequest request);
    ProductModerationQueueResponse getPendingQueue();
}
