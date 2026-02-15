package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.category.CategoryCreateRequest;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Category;
import com.syriamart.commercial.model.SubCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    // 1. Entity -> Response (Root)
    @Mapping(target = "productCount", constant = "0")
    @Mapping(target = "imageUrl", ignore = true) // Not in entity
    CategoryResponse toResponse(Category category);

    // 2. Entity -> Response (Sub) - THIS WAS MISSING IN IMPL
    @Mapping(target = "productCount", constant = "0")
    @Mapping(target = "imageUrl", ignore = true) // Not in entity
    CategoryResponse toSubCategoryResponse(SubCategory subCategory);

    // 3. Request -> Entity (Root)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Category toCategoryEntity(CategoryCreateRequest request);

    // 4. Request -> Entity (Sub)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    SubCategory toSubCategoryEntity(CategoryCreateRequest request);

    // 5. Tree View
    @Mapping(target = "children", source = "subCategories")
    @Mapping(target = "productCount", constant = "0")
    CategoryTreeResponse toTreeResponse(Category category);

    // 6. Tree View Helper (For SubCategories inside the list)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "adminProfitPercentage", ignore = true)
    @Mapping(target = "productCount", constant = "0")
    CategoryTreeResponse subCategoryToTreeResponse(SubCategory subCategory);
}
