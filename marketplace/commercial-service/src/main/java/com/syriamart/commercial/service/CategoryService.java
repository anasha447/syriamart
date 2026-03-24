package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.category.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(CategoryCreateRequest request);
    CategoryResponse update(String id, CategoryUpdateRequest request);
    void delete(String id);
    CategoryResponse findById(String id);
    List<CategoryTreeResponse> findAllActiveTree();
    List<CategoryResponse> findAll();

    CategoryResponse createSubCategory(String categoryId, CategoryCreateRequest request);
    CategoryResponse updateSubCategory(String subCategoryId, CategoryUpdateRequest request);
    void deleteSubCategory(String subCategoryId);
}
