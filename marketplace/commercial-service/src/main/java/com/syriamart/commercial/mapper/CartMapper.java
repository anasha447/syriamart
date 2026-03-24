package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.cart.CartItemResponse;
import com.syriamart.commercial.dto.response.cart.CartResponse;
import com.syriamart.commercial.model.Cart;
import com.syriamart.commercial.model.CartItem;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface CartMapper {

    @Mapping(target = "cartItemId",       source = "id")
    @Mapping(target = "productName",      expression = "java( \"\" )")   // enriched by service
    @Mapping(target = "variationSummary", expression = "java( null )")
    @Mapping(target = "imageUrl",         expression = "java( null )")
    @Mapping(target = "lineTotal",        expression = "java( item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())) )")
    @Mapping(target = "inStock",          expression = "java( true )")
    CartItemResponse toItemResponse(CartItem item);
}
