package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.response.pickuppoint.PickupPointResponse;
import com.syriamart.logistics.model.PickupPoint;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface PickupPointMapper {
    PickupPointResponse toResponse(PickupPoint point);
    List<PickupPointResponse> toResponseList(List<PickupPoint> points);
}
