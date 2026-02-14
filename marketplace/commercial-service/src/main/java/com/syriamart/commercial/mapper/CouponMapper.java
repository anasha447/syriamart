package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.coupon.CouponCreateRequest;
import com.syriamart.commercial.dto.response.coupon.CouponResponse;
import com.syriamart.commercial.model.Coupon;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CouponMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "uses", constant = "0")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "sellerId", ignore = true)
    Coupon toEntity(CouponCreateRequest request);

    CouponResponse toResponse(Coupon coupon);
}
