package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.request.category.CategoryUpdateRequest;
import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
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

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository      categoryRepo;
    private final SubCategoryRepository   subCategoryRepo;
    private final CategoryMapper          categoryMapper;

    // ── Category CRUD ─────────────────────────────────────────────────────────

    @Override
    public CategoryResponse create(CategoryCreateRequest req) {
        if (categoryRepo.existsByNameIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Category name already exists: " + req.name());
        }
        Category category = Category.builder()
                .name(req.name())
                .slug(toSlug(req.name()))
                .description(req.description())
                .imageUrl(req.imageUrl())
                .displayOrder(req.displayOrder())
                .build();
        return categoryMapper.toResponse(categoryRepo.save(category));
    }

    @Override
    public CategoryResponse update(String id, CategoryUpdateRequest req) {
        Category category = getCategory(id);
        if (req.name()         != null) { category.setName(req.name()); category.setSlug(toSlug(req.name())); }
        if (req.description()  != null)  category.setDescription(req.description());
        if (req.imageUrl()     != null)  category.setImageUrl(req.imageUrl());
        if (req.active()       != null)  category.setActive(req.active());
        if (req.displayOrder() != null)  category.setDisplayOrder(req.displayOrder());
        return categoryMapper.toResponse(categoryRepo.save(category));
    }

    @Override
    public void delete(String id) {
        Category category = getCategory(id);
        categoryRepo.delete(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findById(String id) {
        return categoryMapper.toResponse(getCategory(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryTreeResponse> findAllActiveTree() {
        return categoryRepo.findAllActiveWithSubCategories()
                           .stream()
                           .map(categoryMapper::toTreeResponse)
                           .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryMapper.toResponseList(categoryRepo.findAll());
    }

    // ── SubCategory CRUD ──────────────────────────────────────────────────────

    @Override
    public CategoryResponse createSubCategory(String categoryId, CategoryCreateRequest req) {
        Category parent = getCategory(categoryId);
        if (subCategoryRepo.existsByNameIgnoreCaseAndCategoryId(req.name(), categoryId)) {
            throw new IllegalArgumentException("SubCategory '" + req.name() + "' already exists in this category.");
        }
        SubCategory sub = SubCategory.builder()
                .category(parent)
                .name(req.name())
                .slug(toSlug(req.name()))
                .description(req.description())
                .imageUrl(req.imageUrl())
                .displayOrder(req.displayOrder())
                .build();
        subCategoryRepo.save(sub);
        return categoryMapper.toResponse(categoryRepo.save(parent));
    }

    @Override
    public CategoryResponse updateSubCategory(String subId, CategoryUpdateRequest req) {
        SubCategory sub = subCategoryRepo.findById(subId)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory", subId));
        if (req.name()         != null) { sub.setName(req.name()); sub.setSlug(toSlug(req.name())); }
        if (req.description()  != null)  sub.setDescription(req.description());
        if (req.imageUrl()     != null)  sub.setImageUrl(req.imageUrl());
        if (req.active()       != null)  sub.setActive(req.active());
        if (req.displayOrder() != null)  sub.setDisplayOrder(req.displayOrder());
        subCategoryRepo.save(sub);
        return categoryMapper.toResponse(sub.getCategory());
    }

    @Override
    public void deleteSubCategory(String subId) {
        SubCategory sub = subCategoryRepo.findById(subId)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory", subId));
        subCategoryRepo.delete(sub);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Category getCategory(String id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return NON_LATIN.matcher(
                WHITESPACE.matcher(normalized.toLowerCase(Locale.ENGLISH))
                          .replaceAll("-"))
                .replaceAll("")
                .replaceAll("-+", "-");
    }
}
