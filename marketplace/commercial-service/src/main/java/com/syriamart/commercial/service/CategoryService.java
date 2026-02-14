package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.category.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
import com.syriamart.commercial.dto.response.category.CategoryResponse;

import java.util.List;

public interface CategoryService {

    /**
     * Creates a new Root Category or SubCategory based on the request.
     */
    CategoryResponse createCategory(CategoryCreateRequest request);

    /**
     * Updates an existing Category or SubCategory.
     */
    CategoryResponse updateCategory(String id, CategoryUpdateRequest request);

    /**
     * Deletes a Category or SubCategory by ID.
     */
    void deleteCategory(String id);

    /**
     * Retrieves the full category tree hierarchy (Root -> Children).
     * Ideal for navigation menus.
     */
    List<CategoryTreeResponse> getCategoryTree();

    /**
     * Retrieves a single category or sub-category by its ID.
     */
    CategoryResponse getCategoryById(String id);
}
