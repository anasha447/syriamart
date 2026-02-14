package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.product.ProductCreateRequest;
import com.syriamart.commercial.dto.response.product.ProductDetailResponse;
import com.syriamart.commercial.dto.response.product.ProductListResponse;
import com.syriamart.common.dto.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    PageResponse<ProductListResponse> getAllProducts(Pageable pageable);
    ProductDetailResponse getProductById(String id);
    ProductDetailResponse createProduct(ProductCreateRequest request, String sellerIdOrEmail);
}
