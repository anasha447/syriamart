package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.customer.OrderListResponse;
import com.syriamart.commercial.dto.response.customer.OrderDetailResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface OrderMapper {

    @Mapping(target = "itemCount", expression = "java(order.getOrderItems() != null ? order.getOrderItems().size() : 0)")
    @Mapping(target = "sellerName", constant = "SyriaMart Seller")
    @Mapping(target = "status", expression = "java(order.getStatus() != null ? order.getStatus().name() : \"PENDING\")")
    OrderListResponse toListResponse(Order order);

    @Mapping(target = "status", expression = "java(order.getStatus() != null ? order.getStatus().name() : \"PENDING\")")
    @Mapping(target = "paymentStatus", expression = "java(order.getPaymentStatus() != null ? order.getPaymentStatus() : \"PENDING\")")
    @Mapping(target = "deliveryAddress", ignore = true)
    @Mapping(target = "items", ignore = true) // Needs OrderItemMapper
    OrderDetailResponse toDetailResponse(Order order);
}
