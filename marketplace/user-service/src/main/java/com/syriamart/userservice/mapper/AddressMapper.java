package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.address.AddressCreateRequest;
import com.syriamart.userservice.dto.request.address.AddressUpdateRequest;
import com.syriamart.userservice.dto.response.address.AddressResponse;
import com.syriamart.userservice.model.Address;
import com.syriamart.userservice.model.enums.AddressType;
import org.mapstruct.*;

// Use ONLY componentModel = "spring" here.
// Do not reference the common-lib config for now.
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AddressMapper {

    @Mapping(target = "type", expression = "java(mapAddressType(request.type()))")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true) // Add these
    @Mapping(target = "updatedAt", ignore = true) // just in case
    Address toEntity(AddressCreateRequest request);

    @Mapping(target = "type", expression = "java(address.getType() != null ? address.getType().name() : null)")
    AddressResponse toResponse(Address address);

    @Mapping(target = "type", expression = "java(mapAddressType(request.type()))")
    void updateEntity(@MappingTarget Address address, AddressUpdateRequest request);

    default AddressType mapAddressType(String type) {
        if (type == null) return null;
        try {
            return AddressType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}