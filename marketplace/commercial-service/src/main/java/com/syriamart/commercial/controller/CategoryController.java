package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.admin.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.admin.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.admin.CategoryTreeResponse;
import com.syriamart.commercial.dto.response.customer.CategoryResponse;
import com.syriamart.commercial.service.Impl.CategoryServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    // ====================================================
    // PUBLIC ENDPOINTS (Anyone can see categories)
    // ====================================================

    @GetMapping("/public/categories")
    public ResponseEntity<List<CategoryTreeResponse>> getAllCategoriesTree() {
        return ResponseEntity.ok(categoryService.getCategoryTree());
    }

    @GetMapping("/public/categories/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable String id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // ====================================================
    // ADMIN ENDPOINTS (Restricted Access)
    // ====================================================

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')") // Logic depends on your Security Setup
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryCreateRequest request) {
        return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable String id,
            @Valid @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}