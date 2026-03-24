package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.product.*;
import com.syriamart.commercial.dto.response.product.*;
import com.syriamart.commercial.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ── Public Catalog ────────────────────────────────────────────────────────

    @GetMapping("/search")
    public ResponseEntity<ProductSearchResponse> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.search(q,
                PageRequest.of(page, size, Sort.by("totalSold").descending())));
    }

    @GetMapping("/top-selling")
    public ResponseEntity<ProductListResponse> topSelling(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(productService.findTopSelling(limit));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ProductListResponse> topRated(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(productService.findTopRated(limit));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ProductCatalogResponse> byCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "24") int size) {
        return ResponseEntity.ok(productService.findByCategory(categoryId,
                PageRequest.of(page, size)));
    }

    @GetMapping("/sub-category/{subCategoryId}")
    public ResponseEntity<ProductCatalogResponse> bySubCategory(
            @PathVariable String subCategoryId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "24") int size) {
        return ResponseEntity.ok(productService.findBySubCategory(subCategoryId,
                PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.findBySlug(slug));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ProductListResponse> bySeller(
            @PathVariable String sellerId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.findBySeller(sellerId,
                PageRequest.of(page, size)));
    }

    // ── Seller ────────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDetailResponse> create(
            @Valid @RequestBody ProductCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(productService.createProduct(user.getUsername(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDetailResponse> update(
            @PathVariable String id,
            @Valid @RequestBody ProductUpdateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.updateProduct(id, user.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user) {
        productService.deleteProduct(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDetailResponse> addImages(
            @PathVariable String id,
            @Valid @RequestBody List<ProductImageRequest> requests,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.addImages(id, user.getUsername(), requests));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> removeImage(
            @PathVariable String id,
            @PathVariable String imageId,
            @AuthenticationPrincipal UserDetails user) {
        productService.removeImage(id, imageId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/variations")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDetailResponse> setVariations(
            @PathVariable String id,
            @Valid @RequestBody List<ProductVariationRequest> requests,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.setVariations(id, user.getUsername(), requests));
    }

    // ── My products (seller's own view, all statuses) ──────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductListResponse> myProducts(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.findBySeller(user.getUsername(),
                PageRequest.of(page, size)));
    }

    // ── Admin Moderation ──────────────────────────────────────────────────────

    @GetMapping("/admin/moderation-queue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductModerationQueueResponse> moderationQueue() {
        return ResponseEntity.ok(productService.getPendingQueue());
    }

    @PatchMapping("/admin/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDetailResponse> moderate(
            @PathVariable String id,
            @Valid @RequestBody ProductModerationRequest request) {
        return ResponseEntity.ok(productService.moderate(id, request));
    }
}
