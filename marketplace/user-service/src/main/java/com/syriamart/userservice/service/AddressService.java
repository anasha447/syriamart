package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.address.AddressCreateRequest;
import com.syriamart.userservice.dto.request.address.AddressUpdateRequest;
import com.syriamart.userservice.dto.response.address.AddressResponse;

import java.util.List;

public interface AddressService {
    AddressResponse createAddress(String userId, AddressCreateRequest request);
    AddressResponse updateAddress(String addressId, String userId, AddressUpdateRequest request);
    List<AddressResponse> getUserAddresses(String userId);
}
