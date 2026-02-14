package com.syriamart.userservice.mapper;

import com.syriamart.commercial.dto.request.customer.UserRegistrationRequest;
import com.syriamart.commercial.dto.response.admin.UserManagementResponse;
import com.syriamart.commercial.dto.response.customer.UserProfileResponse;
import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.commercial.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface UserMapper {

    @Mapping(target = "orderCount", expression = "java(user.getOrders() != null ? user.getOrders().size() : 0)")
    UserManagementResponse toManagementResponse(User user);

    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "orderCount", expression = "java(user.getOrders() != null ? user.getOrders().size() : 0)")
    UserProfileResponse toProfileResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true) // Encoded by service
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    User toEntity(UserRegistrationRequest request);
}
