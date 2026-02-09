package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.seller.ProductCreateRequest;
import com.syriamart.commercial.dto.request.seller.ProductUpdateRequest;
import com.syriamart.commercial.dto.response.seller.ProductDetailResponse;
import com.syriamart.commercial.dto.response.seller.ProductListResponse;
import com.syriamart.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDetailResponse createProduct(ProductCreateRequest request, String sellerId);
    ProductDetailResponse updateProduct(String id, ProductUpdateRequest request);
    ProductDetailResponse getProductById(String id);
    PageResponse<ProductListResponse> getAllProducts(Pageable pageable);
    void deleteProduct(String id);

    ProductDetailResponse moderateProduct(String id, boolean approve);
}