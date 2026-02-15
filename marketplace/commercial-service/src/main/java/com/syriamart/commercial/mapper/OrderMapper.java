package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.order.OrderListResponse;
import com.syriamart.commercial.dto.response.order.OrderDetailResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", uses = {OrderItemMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    @Mapping(target = "itemCount", expression = "java(order.getOrderItems() != null ? order.getOrderItems().size() : 0)")
    @Mapping(target = "sellerName", constant = "SyriaMart Seller") // Placeholder, needs fetching
    @Mapping(target = "status", expression = "java(order.getStatus() != null ? order.getStatus().name() : \"PENDING\")")
    OrderListResponse toListResponse(Order order);

    @Mapping(target = "status", expression = "java(order.getStatus() != null ? order.getStatus().name() : \"PENDING\")")
    @Mapping(target = "paymentStatus", expression = "java(order.getPaymentStatus() != null ? order.getPaymentStatus() : \"PENDING\")")
    @Mapping(target = "deliveryAddress", ignore = true) // Needs fetching address by ID
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "customerNameSnapshot", ignore = true) // To be populated by service
    @Mapping(target = "customerEmailSnapshot", ignore = true) // To be populated by service
    @Mapping(target = "shippingAddressSnapshot", ignore = true) // To be populated by service
    @Mapping(target = "contactPhoneSnapshot", ignore = true) // To be populated by service
    @Mapping(target = "pickupPoint", ignore = true) // To be populated by service
    @Mapping(target = "statusHistory", ignore = true) // To be populated by service
    @Mapping(target = "latestScan", ignore = true) // To be populated by service
    OrderDetailResponse toDetailResponse(Order order);
}
