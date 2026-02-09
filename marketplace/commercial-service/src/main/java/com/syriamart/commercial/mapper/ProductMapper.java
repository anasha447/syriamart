package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.seller.ProductCreateRequest;
import com.syriamart.commercial.dto.response.seller.ProductListResponse;
import com.syriamart.commercial.dto.response.seller.ProductDetailResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// Added componentModel = "spring" to allow Autowiring
@Mapper(componentModel = "spring", config = MapperConfigData.class)
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "subCategory.name")
    @Mapping(target = "status", expression = "java(product.getStatus() != null ? product.getStatus().name().toLowerCase() : \"unknown\")")
    ProductListResponse toListResponse(Product product);

    @Mapping(target = "categoryId", source = "subCategory.id")
    @Mapping(target = "categoryName", source = "subCategory.name")
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "subCategory", ignore = true) // Handled by service
    @Mapping(target = "seller", ignore = true) // Handled by service
    @Mapping(target = "orderItems", ignore = true)
    Product toEntity(ProductCreateRequest request);
}