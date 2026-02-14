package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.wishlist.WishlistCreateRequest;
import com.syriamart.commercial.dto.response.wishlist.WishlistItemResponse;
import com.syriamart.commercial.dto.response.wishlist.WishlistResponse;
import com.syriamart.commercial.model.Wishlist;
import com.syriamart.commercial.model.WishlistItem;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WishlistMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true) // Authenticated user
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "wishlistItems", ignore = true)
    Wishlist toEntity(WishlistCreateRequest request);

    @Mapping(target = "itemCount", expression = "java(wishlist.getWishlistItems() != null ? wishlist.getWishlistItems().size() : 0)")
    @Mapping(target = "name", constant = "My Wishlist") // Placeholder if name isn't in entity
    WishlistResponse toResponse(Wishlist wishlist);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "imageUrl", source = "product.mainImageUrl")
    @Mapping(target = "inStock", expression = "java(item.getProduct().getStock() > 0)")
    @Mapping(target = "addedAt", source = "createdAt")
    WishlistItemResponse toItemResponse(WishlistItem item);
}
