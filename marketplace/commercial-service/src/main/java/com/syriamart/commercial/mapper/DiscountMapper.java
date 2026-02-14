package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.coupon.DiscountCreateRequest;
import com.syriamart.commercial.dto.response.coupon.DiscountResponse;
import com.syriamart.commercial.model.Discount;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DiscountMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "description") // Mapping description to name or vice versa depending on intent
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "sellerId", ignore = true)
    Discount toEntity(DiscountCreateRequest request);

    @Mapping(target = "active", constant = "true") // Entity doesn't have active boolean, assuming true or check logic
    @Mapping(target = "targetName", ignore = true) // Needs fetching based on scopeType + targetId
    DiscountResponse toResponse(Discount discount);
}
