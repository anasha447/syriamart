package com.syriamart.userservice.service.impl;

import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.mapper.UserMapper;
import com.syriamart.userservice.model.Address;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.enums.AddressType;
import com.syriamart.userservice.model.enums.SellerStatus;
import com.syriamart.userservice.repository.AddressRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final AddressRepository addressRepository;
    private final UserMapper userMapper;

    @Override
    public List<SellerDetailResponse> getAllSellers() {
        log.info("Admin fetching master list of all sellers");
        return sellerRepository.findAll().stream()
                .map(userMapper::toSellerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SellerDetailResponse getSellerProfile(String sellerId) {
        log.info("Fetching detail profile for seller: {}", sellerId);
        return sellerRepository.findById(sellerId)
                .map(userMapper::toSellerResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));
    }

    @Override
    public List<SellerDetailResponse> getPendingSellers() {
        log.info("Fetching all sellers awaiting approval");
        return sellerRepository.findByStatus(SellerStatus.PENDING).stream()
                .map(userMapper::toSellerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SellerDetailResponse> getActiveSellers() {
        return sellerRepository.findByStatus(SellerStatus.ACTIVE).stream()
                .map(userMapper::toSellerResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SellerDetailResponse updateSellerProfile(String sellerId, SellerProfileUpdateRequest request) {
        log.info("Updating profile for seller: {}", sellerId);
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));

        // 1. Map basic Seller info (name, phone, storeName, storeLocation, productType)
        userMapper.updateSellerFromRequest(seller, request);

        // 2. Handle the Image URL explicitly
        if (request.profileImageUrl() != null) {
            seller.setProfileImageUrl(request.profileImageUrl());
        }

        // 3. Handle the Address Logic (if address fields were provided)
        if (request.city() != null || request.fullAddress() != null || request.landmark() != null) {
            updateOrCreateStoreAddress(seller, request);
        }

        Seller savedSeller = sellerRepository.save(seller);
        return userMapper.toSellerResponse(savedSeller);
    }

    private void updateOrCreateStoreAddress(Seller seller, SellerProfileUpdateRequest request) {
        // Look for an existing STORE address
        Optional<Address> existingAddress = addressRepository.findBySellerId(seller.getId())
                .stream()
                .filter(a -> AddressType.STORE.equals(a.getType()))
                .findFirst();

        Address address;
        if (existingAddress.isPresent()) {
            address = existingAddress.get();
        } else {
            // Create a new address if one doesn't exist
            address = Address.builder()
                    .seller(seller)
                    .type(AddressType.STORE)
                    // Set safe defaults for database constraints
                    .country("India")
                    .state("Pending Update")
                    .postalCode("000000")
                    .build();
        }

        // Update fields if provided in the PUT request (Partial Updates)
        if (request.city() != null) address.setCity(request.city());
        if (request.fullAddress() != null) address.setAddressLine1(request.fullAddress());
        if (request.landmark() != null) address.setAddressLine2(request.landmark());

        addressRepository.save(address);
    }

    @Override
    @Transactional
    public void approveSeller(String sellerId, SellerApprovalRequest request) {
        log.info("Processing approval for seller: {}", sellerId);
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));

        if (request.approved()) {
            seller.setAdminApproved(true);
            seller.setStatus(SellerStatus.ACTIVE);

            if (request.approvedByAdminName() != null) {
                // Assuming you have this field in your Seller entity
                // seller.setApprovedByAdminName(request.approvedByAdminName());
            }

            log.info("Seller {} approved.", sellerId);
        } else {
            seller.setAdminApproved(false);
            seller.setStatus(SellerStatus.SUSPENDED);
            log.warn("Seller {} rejected. Reason: {}", sellerId, request.rejectionReason());
        }

        sellerRepository.save(seller);
    }
}