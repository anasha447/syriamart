package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.admin.CategoryCreateRequest;
import com.syriamart.commercial.dto.response.customer.CategoryResponse;
import com.syriamart.commercial.dto.response.admin.CategoryTreeResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface  CategoryMapper {

    @Mapping(target = "productCount", constant = "0")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    Category toEntity(CategoryCreateRequest request);

    @Mapping(target = "children", source = "subCategories")
    @Mapping(target = "productCount", constant = "0")
    CategoryTreeResponse toTreeResponse(Category category);
}
