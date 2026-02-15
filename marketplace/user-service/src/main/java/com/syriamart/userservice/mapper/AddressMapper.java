package com.syriamart.userservice.mapper;

import com.syriamart.userservice.dto.request.address.AddressCreateRequest;
import com.syriamart.userservice.dto.request.address.AddressUpdateRequest;
import com.syriamart.userservice.dto.response.address.AddressResponse;
import com.syriamart.userservice.model.Address;
import com.syriamart.userservice.model.enums.AddressType;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.*;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AddressMapper {

    @Mapping(target = "type", expression = "java(mapAddressType(request.type()))")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "admin", ignore = true)
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
