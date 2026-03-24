package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.coupon.DiscountResponse;
import com.syriamart.commercial.model.Discount;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfigData.class)
public interface DiscountMapper {
    DiscountResponse toResponse(Discount discount);
}
