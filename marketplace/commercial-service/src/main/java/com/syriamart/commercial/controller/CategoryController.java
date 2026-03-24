package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.category.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
import com.syriamart.commercial.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<CategoryTreeResponse>> getAll() {
        return ResponseEntity.ok(categoryService.findAllActiveTree());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> create(
            @Valid @RequestBody CategoryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(categoryService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── SubCategory (Admin only) ───────────────────────────────────────────────

    @PostMapping("/{categoryId}/sub-categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createSub(
            @PathVariable String categoryId,
            @Valid @RequestBody CategoryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(categoryService.createSubCategory(categoryId, request));
    }

    @PutMapping("/sub-categories/{subId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateSub(
            @PathVariable String subId,
            @Valid @RequestBody CategoryUpdateRequest request) {
        return ResponseEntity.ok(categoryService.updateSubCategory(subId, request));
    }

    @DeleteMapping("/sub-categories/{subId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSub(@PathVariable String subId) {
        categoryService.deleteSubCategory(subId);
        return ResponseEntity.noContent().build();
    }
}
