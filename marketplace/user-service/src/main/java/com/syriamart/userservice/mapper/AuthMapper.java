package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AuthMapper {

    @Mapping(target = "accessToken", source = "token")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    AuthenticationResponse toResponse(User user, String token);
}
