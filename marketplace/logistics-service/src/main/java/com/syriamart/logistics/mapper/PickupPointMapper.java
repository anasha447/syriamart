package com.syriamart.logistics.mapper;

import com.syriamart.logistics.dto.request.pickuppoint.PickupPointCreateRequest;
import com.syriamart.logistics.dto.response.address.AddressResponse;
import com.syriamart.logistics.dto.response.pickuppoint.PickupPointResponse;
import com.syriamart.logistics.model.PickupPoint;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PickupPointMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sellerId", ignore = true) // Set by service or logic
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "addressId", source = "addressId")
    PickupPoint toEntity(PickupPointCreateRequest request);

    @Mapping(target = "id", source = "pickupPoint.id")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "contactPhone", ignore = true) // Not in entity
    @Mapping(target = "isActive", constant = "true") // Entity doesn't have isActive
    PickupPointResponse toResponse(PickupPoint pickupPoint, AddressResponse address);
}
