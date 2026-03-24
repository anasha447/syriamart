package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.response.driver.*;
import com.syriamart.logistics.model.Driver;
import com.syriamart.logistics.model.DriverProfile;
import com.syriamart.logistics.model.DriverShift;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface DriverMapper {

    @Mapping(target = "lastLocationUpdate",
             expression = "java( driver.getLastLocationUpdate() != null ? driver.getLastLocationUpdate().toString() : null )")
    DriverInfoResponse toInfo(Driver driver);

    @Mapping(target = "averageRating",      source = "profile.averageRating")
    @Mapping(target = "totalDeliveries",    source = "profile.totalDeliveries")
    @Mapping(target = "successRate",        expression = "java( driver.getProfile() != null ? driver.getProfile().successRate() : 0.0 )")
    @Mapping(target = "totalEarnings",      source = "profile.totalEarnings")
    @Mapping(target = "pendingPayout",      source = "profile.pendingPayout")
    @Mapping(target = "profilePhotoUrl",    source = "profile.profilePhotoUrl")
    @Mapping(target = "vehicleType",        source = "profile.vehicleType")
    @Mapping(target = "vehicleMake",        source = "profile.vehicleMake")
    @Mapping(target = "vehicleModel",       source = "profile.vehicleModel")
    @Mapping(target = "vehicleYear",        source = "profile.vehicleYear")
    @Mapping(target = "vehiclePlate",       source = "profile.vehiclePlate")
    @Mapping(target = "vehicleColor",       source = "profile.vehicleColor")
    @Mapping(target = "licenseNumber",      source = "profile.licenseNumber")
    @Mapping(target = "licenseExpiry",      source = "profile.licenseExpiry")
    DriverProfileResponse toProfile(Driver driver);

    @Mapping(target = "make",  source = "vehicleMake")
    @Mapping(target = "model", source = "vehicleModel")
    @Mapping(target = "year",  source = "vehicleYear")
    @Mapping(target = "plate", source = "vehiclePlate")
    @Mapping(target = "color", source = "vehicleColor")
    VehicleDetailsResponse toVehicleDetails(DriverProfile profile);

    @Mapping(target = "shiftId",    source = "id")
    ShiftSummaryResponse toShiftSummary(DriverShift shift);

    List<DriverInfoResponse> toInfoList(List<Driver> drivers);
}
