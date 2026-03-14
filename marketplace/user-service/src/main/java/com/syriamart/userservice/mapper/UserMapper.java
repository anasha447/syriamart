package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.model.Seller;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = { AddressMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    void updateUserFromRequest(@MappingTarget User user, UserProfileUpdateRequest request);

    UserProfileResponse toResponse(User user);

    @Mapping(target = "accessToken", source = "token")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    AuthenticationResponse toAuthResponse(User user, String token);

    void updateSellerFromRequest(@MappingTarget Seller seller, SellerProfileUpdateRequest request);

    @Mapping(target = "approvedByAdminName", source = "approvedByAdmin.fullName")
    @Mapping(target = "approvedAt", ignore = true) // Seller entity doesn't have approvedAt, so ignore for now
    SellerDetailResponse toSellerResponse(Seller seller);
}
