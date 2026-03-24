package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.wishlist.WishlistResponse;
import com.syriamart.commercial.model.Wishlist;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface WishlistMapper {
    @Mapping(target = "items", expression = "java( java.util.List.of() )") // enriched by service
    WishlistResponse toResponse(Wishlist wishlist);
}
