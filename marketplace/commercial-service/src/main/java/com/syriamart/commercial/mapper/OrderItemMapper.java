package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.order.OrderItemResponse;
import com.syriamart.commercial.model.OrderItem;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderItemMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productImageUrl", source = "product.mainImageUrl")
    @Mapping(target = "variationDetails", expression = "java(item.getVariationValue() != null && item.getVariationValue().getVariationOption() != null ? item.getVariationValue().getVariationOption().getValue() : null)")
    @Mapping(target = "subtotal", expression = "java(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))")
    @Mapping(target = "status", constant = "PENDING") // Items inherit order status usually, but for now placeholder
    OrderItemResponse toResponse(OrderItem item);
}
