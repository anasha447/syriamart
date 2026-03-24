package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.product.ProductVariationResponse;
import com.syriamart.commercial.dto.response.product.VariationOptionResponse;
import com.syriamart.commercial.model.ProductVariation;
import com.syriamart.commercial.model.VariationOption;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface ProductVariationMapper {
    ProductVariationResponse toResponse(ProductVariation variation);
    VariationOptionResponse toOptionResponse(VariationOption option);
    List<ProductVariationResponse> toResponseList(List<ProductVariation> variations);
}
