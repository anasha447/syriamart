package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.model.User;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuthMapper {

    @Mapping(target = "accessToken", source = "token")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    AuthenticationResponse toResponse(User user, String token);
}
