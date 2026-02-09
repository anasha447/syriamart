package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.request.admin.DriverRegistrationRequest;
import com.syriamart.logistics.dto.response.driver.DriverProfileResponse;
import com.syriamart.project.model.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfigData.class)
public interface DriverMapper {

    @Mapping(target = "driverId", source = "id")
    @Mapping(target = "rating", source = "currentRating")
    @Mapping(target = "joinedDate", expression = "java(driver.getCreatedAt().toLocalDate())")
    DriverProfileResponse toProfileResponse(Driver driver);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "OFFLINE")
    @Mapping(target = "currentRating", constant = "5.0")
    @Mapping(target = "totalDeliveries", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Driver toEntity(DriverRegistrationRequest request);
}
