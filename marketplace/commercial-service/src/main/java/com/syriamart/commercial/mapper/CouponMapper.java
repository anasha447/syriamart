package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.coupon.CouponResponse;
import com.syriamart.commercial.model.Coupon;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface CouponMapper {
    CouponResponse toResponse(Coupon coupon);
    List<CouponResponse> toResponseList(List<Coupon> coupons);
}
