package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.product.ProductCreateRequest;
import com.syriamart.commercial.dto.response.product.ProductDetailResponse;
import com.syriamart.commercial.dto.response.product.ProductListResponse;
import com.syriamart.commercial.service.ProductService;
import com.syriamart.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PageResponse<ProductListResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDetailResponse> createProduct(
            @RequestBody @Valid ProductCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() is the userId in our JWT setup usually, or email.
        // Assuming userId for now or service handles lookup
        return ResponseEntity.ok(productService.createProduct(request, userDetails.getUsername()));
    }
}
