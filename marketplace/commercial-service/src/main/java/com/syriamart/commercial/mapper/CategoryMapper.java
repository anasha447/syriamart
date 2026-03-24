package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.category.CategoryResponse;
import com.syriamart.commercial.dto.response.category.CategoryTreeResponse;
import com.syriamart.commercial.model.Category;
import com.syriamart.commercial.model.SubCategory;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    @Mapping(target = "subCategories", source = "subCategories")
    CategoryTreeResponse toTreeResponse(Category category);

    CategoryTreeResponse.SubCategoryResponse toSubResponse(SubCategory subCategory);

    List<CategoryResponse> toResponseList(List<Category> categories);
}
