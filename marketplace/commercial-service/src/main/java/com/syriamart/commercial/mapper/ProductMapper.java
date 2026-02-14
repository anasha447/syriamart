package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.product.ProductCreateRequest;
import com.syriamart.commercial.dto.response.product.ProductDetailResponse;
import com.syriamart.commercial.dto.response.product.ProductListResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", uses = {ProductImageMapper.class, ProductVariationMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "subCategory.name")
    @Mapping(target = "status", expression = "java(product.getStatus() != null ? product.getStatus().name() : \"unknown\")")
    ProductListResponse toListResponse(Product product);

    @Mapping(target = "categoryId", source = "subCategory.id")
    @Mapping(target = "categoryName", source = "subCategory.name")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "activeDiscount", ignore = true) // Needs logic
    @Mapping(target = "averageRating", constant = "0.0") // Needs ReviewService
    @Mapping(target = "reviewCount", constant = "0") // Needs ReviewService
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "status", constant = "PENDING_APPROVAL")
    @Mapping(target = "subCategory", ignore = true) // Handled by service
    @Mapping(target = "sellerId", ignore = true) // Handled by service
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "adminApproved", constant = "false")
    @Mapping(target = "images", source = "additionalImages")
    Product toEntity(ProductCreateRequest request);
}
