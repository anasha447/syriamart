package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.product.ProductImageResponse;
import com.syriamart.commercial.model.ProductImage;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface ProductImageMapper {
    ProductImageResponse toResponse(ProductImage image);
    List<ProductImageResponse> toResponseList(List<ProductImage> images);
}
