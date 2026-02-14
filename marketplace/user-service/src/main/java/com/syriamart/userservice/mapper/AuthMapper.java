package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.response.admin.AuthenticationResponse;
import com.syriamart.userservice.model.User;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class, componentModel = "spring")
public interface AuthMapper {

    // 1. Map the 'token' string to 'accessToken'
    @Mapping(target = "accessToken", source = "token")

    // 2. Map fields from the User entity
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "userId", source = "user.id")

    // 3. Convert the Enum role to a String
    @Mapping(target = "role", expression = "java(user.getRole().name())")

    AuthenticationResponse toResponse(User user, String token);
}