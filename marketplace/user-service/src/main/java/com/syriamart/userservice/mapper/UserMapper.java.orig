package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import com.syriamart.userservice.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = { AddressMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    void updateUserFromRequest(@MappingTarget User user, UserProfileUpdateRequest request);

    UserProfileResponse toResponse(User user);
}
