package com.syriamart.logistics.service;

import com.syriamart.logistics.dto.request.pickuppoint.PickupPointCreateRequest;
import com.syriamart.logistics.dto.response.pickuppoint.PickupPointResponse;

import java.util.List;

public interface PickupPointService {
    PickupPointResponse create(PickupPointCreateRequest req);
    PickupPointResponse update(String id, PickupPointCreateRequest req);
    void delete(String id);
    List<PickupPointResponse> findAll();
    List<PickupPointResponse> findByCity(String city);
    PickupPointResponse findById(String id);
}
