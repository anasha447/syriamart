package com.syriamart.commercial.service.Impl;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.category.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.commercial.mapper.CategoryMapper;
import com.syriamart.commercial.model.Category;
import com.syriamart.commercial.model.SubCategory;
import com.syriamart.commercial.repository.CategoryRepository;
import com.syriamart.commercial.repository.SubCategoryRepository;
import com.syriamart.commercial.service.CategoryService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        if (request.parentCategoryId() != null && !request.parentCategoryId().isBlank()) {
            return createSubCategory(request);
        } else {
            return createRootCategory(request);
        }
    }

    private CategoryResponse createRootCategory(CategoryCreateRequest request) {
        Category category = categoryMapper.toCategoryEntity(request);
        // ID generation is usually handled by BaseEntity or DB, but keeping existing logic if not
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    private CategoryResponse createSubCategory(CategoryCreateRequest request) {
        Category parent = categoryRepository.findById(request.parentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent Category not found with id: " + request.parentCategoryId()));

        SubCategory subCategory = categoryMapper.toSubCategoryEntity(request);
        subCategory.setCategory(parent);
        return categoryMapper.toSubCategoryResponse(subCategoryRepository.save(subCategory));
    }

    @Override
    public CategoryResponse updateCategory(String id, CategoryUpdateRequest request) {
        return categoryRepository.findById(id)
                .map(category -> {
                    if (request.name() != null) category.setName(request.name());
                    if (request.description() != null) category.setDescription(request.description());
                    if (request.adminProfitPercentage() != null) category.setAdminProfitPercentage(request.adminProfitPercentage());
                    return categoryMapper.toResponse(categoryRepository.save(category));
                })
                .map(response -> (CategoryResponse) response) // Cast to satisfy return type inference if needed
                .orElseGet(() -> updateSubCategory(id, request));
    }

    private CategoryResponse updateSubCategory(String id, CategoryUpdateRequest request) {
        SubCategory sub = subCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (request.name() != null) sub.setName(request.name());
        if (request.description() != null) sub.setDescription(request.description());

        return categoryMapper.toSubCategoryResponse(subCategoryRepository.save(sub));
    }

    @Override
    public void deleteCategory(String id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        } else if (subCategoryRepository.existsById(id)) {
            subCategoryRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryTreeResponse> getCategoryTree() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toTreeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(String id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toResponse)
                .or(() -> subCategoryRepository.findById(id).map(categoryMapper::toSubCategoryResponse))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
