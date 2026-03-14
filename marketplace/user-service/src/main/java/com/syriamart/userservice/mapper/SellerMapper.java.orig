package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.model.Seller;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = { AddressMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SellerMapper {

    void updateSellerFromRequest(@MappingTarget Seller seller, SellerProfileUpdateRequest request);

    @Mapping(target = "approvedByAdminName", source = "approvedByAdmin.fullName")
    @Mapping(target = "approvedAt", ignore = true) // Seller entity doesn't have approvedAt, so ignore for now
    SellerDetailResponse toResponse(Seller seller);
}
