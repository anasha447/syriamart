package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.product.ProductImageRequest;
import com.syriamart.commercial.dto.response.product.ProductImageResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductImageMapper {

    ProductImageResponse toResponse(ProductImage image);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductImage toEntity(ProductImageRequest request);
}
