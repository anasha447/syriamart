package com.syriamart.logistics.service.impl;

import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.logistics.dto.request.pickuppoint.PickupPointCreateRequest;
import com.syriamart.logistics.dto.response.pickuppoint.PickupPointResponse;
import com.syriamart.logistics.mapper.PickupPointMapper;
import com.syriamart.logistics.model.PickupPoint;
import com.syriamart.logistics.repository.PickupPointRepository;
import com.syriamart.logistics.service.PickupPointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PickupPointServiceImpl implements PickupPointService {

    private final PickupPointRepository pickupPointRepo;
    private final PickupPointMapper     pickupPointMapper;

    @Override
    public PickupPointResponse create(PickupPointCreateRequest req) {
        PickupPoint pp = PickupPoint.builder()
                .name(req.name())
                .addressLine1(req.addressLine1())
                .addressLine2(req.addressLine2())
                .city(req.city())
                .governorate(req.governorate())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .contactPhone(req.contactPhone())
                .operatingHours(req.operatingHours())
                .maxCapacity(req.maxCapacity())
                .build();
        return pickupPointMapper.toResponse(pickupPointRepo.save(pp));
    }

    @Override
    public PickupPointResponse update(String id, PickupPointCreateRequest req) {
        PickupPoint pp = get(id);
        pp.setName(req.name());
        pp.setAddressLine1(req.addressLine1());
        pp.setAddressLine2(req.addressLine2());
        pp.setCity(req.city());
        pp.setGovernorate(req.governorate());
        pp.setLatitude(req.latitude());
        pp.setLongitude(req.longitude());
        pp.setContactPhone(req.contactPhone());
        pp.setOperatingHours(req.operatingHours());
        pp.setMaxCapacity(req.maxCapacity());
        return pickupPointMapper.toResponse(pickupPointRepo.save(pp));
    }

    @Override
    public void delete(String id) {
        PickupPoint pp = get(id);
        pp.setActive(false);
        pickupPointRepo.save(pp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupPointResponse> findAll() {
        return pickupPointMapper.toResponseList(pickupPointRepo.findByActiveTrue());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PickupPointResponse> findByCity(String city) {
        return pickupPointMapper.toResponseList(pickupPointRepo.findByCityAndActiveTrue(city));
    }

    @Override
    @Transactional(readOnly = true)
    public PickupPointResponse findById(String id) {
        return pickupPointMapper.toResponse(get(id));
    }

    private PickupPoint get(String id) {
        return pickupPointRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PickupPoint", id));
    }
}
