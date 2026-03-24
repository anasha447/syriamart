package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.order.OrderItemResponse;
import com.syriamart.commercial.model.OrderItem;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface OrderItemMapper {

    @Mapping(target = "productName",       source = "productNameSnapshot")
    @Mapping(target = "variationSnapshot", source = "variationSnapshot")
    @Mapping(target = "imageUrl",          source = "imageUrlSnapshot")
    OrderItemResponse toResponse(OrderItem item);

    List<OrderItemResponse> toResponseList(List<OrderItem> items);
}
