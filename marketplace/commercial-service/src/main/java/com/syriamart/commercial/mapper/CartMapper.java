package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.cart.CartItemResponse;
import com.syriamart.commercial.dto.response.cart.CartResponse;
import com.syriamart.commercial.model.Cart;
import com.syriamart.commercial.model.CartItem;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartMapper {

    @Mapping(target = "cartId", source = "id")
    @Mapping(target = "items", source = "cartItems")
    @Mapping(target = "itemCount", expression = "java(cart.getCartItems() != null ? cart.getCartItems().size() : 0)")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(cart))")
    @Mapping(target = "total", expression = "java(calculateSubtotal(cart))") // Placeholder logic
    @Mapping(target = "discountAmount", constant = "0.0") // Placeholder
    @Mapping(target = "shippingFee", constant = "0.0") // Placeholder
    @Mapping(target = "appliedCouponCode", ignore = true)
    CartResponse toResponse(Cart cart);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productImageUrl", source = "product.mainImageUrl")
    @Mapping(target = "variationDetails", expression = "java(item.getVariationValue() != null && item.getVariationValue().getVariationOption() != null ? item.getVariationValue().getVariationOption().getValue() : null)")
    @Mapping(target = "unitPrice", expression = "java(item.getVariationValue() != null && item.getVariationValue().getPriceOverride() != null ? item.getVariationValue().getPriceOverride() : item.getProduct().getPrice())")
    @Mapping(target = "subtotal", expression = "java(calculateItemSubtotal(item))")
    @Mapping(target = "discountLabel", ignore = true)
    @Mapping(target = "inStock", constant = "true") // Needs logic
    CartItemResponse toItemResponse(CartItem item);

    default BigDecimal calculateSubtotal(Cart cart) {
        if (cart.getCartItems() == null) return BigDecimal.ZERO;
        return cart.getCartItems().stream()
                .map(this::calculateItemSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default BigDecimal calculateItemSubtotal(CartItem item) {
        if (item.getProduct() == null) return BigDecimal.ZERO;
        BigDecimal price = (item.getVariationValue() != null && item.getVariationValue().getPriceOverride() != null)
                ? item.getVariationValue().getPriceOverride()
                : item.getProduct().getPrice();
        return price.multiply(BigDecimal.valueOf(item.getQuantity()));
    }
}
