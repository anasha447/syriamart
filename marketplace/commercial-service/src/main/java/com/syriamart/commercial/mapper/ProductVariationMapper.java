package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.product.ProductVariationRequest;
import com.syriamart.commercial.dto.request.product.VariationOptionRequest;
import com.syriamart.commercial.dto.response.product.ProductVariationResponse;
import com.syriamart.commercial.dto.response.product.VariationOptionResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.ProductVariation;
import com.syriamart.commercial.model.VariationOption;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductVariationMapper {

    @Mapping(target = "options", source = "variationOptions")
    ProductVariationResponse toResponse(ProductVariation variation);

    @Mapping(target = "stock", ignore = true) // Not in VariationOption entity, likely in ProductVariationValue
    @Mapping(target = "price", ignore = true) // Not in VariationOption entity, likely in ProductVariationValue
    @Mapping(target = "sku", ignore = true) // Not in VariationOption entity
    VariationOptionResponse toOptionResponse(VariationOption option);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "variationOptions", ignore = true)
    ProductVariation toEntity(ProductVariationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "variation", ignore = true)
    @Mapping(target = "productVariationValues", ignore = true)
    VariationOption toOptionEntity(VariationOptionRequest request);
}
