package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.user.UserRegistrationRequest;
import com.syriamart.userservice.dto.response.admin.UserManagementResponse;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.userservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", uses = {AddressMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserManagementResponse toManagementResponse(User user);

    @Mapping(target = "addresses", source = "addresses")
    UserProfileResponse toProfileResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true) // Encoded by service
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    User toEntity(UserRegistrationRequest request);
}
