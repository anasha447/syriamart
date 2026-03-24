package com.syriamart.logistics.dto.response.driver;

import com.syriamart.logistics.model.enums.VehicleType;

public record VehicleDetailsResponse(
        VehicleType vehicleType, String make, String model,
        Integer year, String plate, String color
) {}
