package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.order.OrderDetailResponse;
import com.syriamart.commercial.dto.response.order.OrderListResponse;
import com.syriamart.commercial.model.Order;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class, uses = {OrderItemMapper.class})
public interface OrderMapper {

    OrderDetailResponse toDetail(Order order);

    @Mapping(target = "itemCount", expression = "java( order.getItems().size() )")
    OrderListResponse toListResponse(Order order);

    List<OrderListResponse> toListResponseList(List<Order> orders);
}
