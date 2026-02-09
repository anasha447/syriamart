package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.seller.ProductCreateRequest;
import com.syriamart.commercial.dto.request.seller.ProductUpdateRequest;
import com.syriamart.commercial.dto.response.seller.ProductDetailResponse;
import com.syriamart.commercial.dto.response.seller.ProductListResponse;
import com.syriamart.commercial.service.ProductService;
import com.syriamart.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ==========================================
    // PUBLIC ENDPOINTS (Customers)
    // ==========================================

    @GetMapping("/api/v1/products")
    public ResponseEntity<PageResponse<ProductListResponse>> getAllPublicProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/api/v1/products/{id}")
    public ResponseEntity<ProductDetailResponse> getPublicProductDetail(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ==========================================
    // SELLER ENDPOINTS (Vendors)
    // ==========================================

    @PostMapping("/api/v1/seller/products")
    public ResponseEntity<ProductDetailResponse> sellerCreateProduct(
            @Valid @RequestBody ProductCreateRequest request,
            @RequestHeader("X-Seller-Id") String sellerId) {
        return new ResponseEntity<>(productService.createProduct(request, sellerId), HttpStatus.CREATED);
    }

    @PutMapping("/api/v1/seller/products/{id}")
    public ResponseEntity<ProductDetailResponse> sellerUpdateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/api/v1/seller/products/{id}")
    public ResponseEntity<Void> sellerDeleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // ADMIN ENDPOINTS (Moderators)
    // ==========================================

    @PatchMapping("/api/v1/admin/products/{id}/approve")
    public ResponseEntity<ProductDetailResponse> adminApproveProduct(
            @PathVariable String id,
            @RequestParam boolean approve) {
        // Logic to toggle adminApproved and update status
        return ResponseEntity.ok(productService.moderateProduct(id, approve));
    }
}