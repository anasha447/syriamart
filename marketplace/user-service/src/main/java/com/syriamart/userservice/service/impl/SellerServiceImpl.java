package com.syriamart.userservice.service.impl;

import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.mapper.UserMapper;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.enums.SellerStatus;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
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

        userMapper.updateSellerFromRequest(seller, request);
        Seller savedSeller = sellerRepository.save(seller);

        return userMapper.toSellerResponse(savedSeller);
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
            log.info("Seller {} approved.", sellerId);
        } else {
            seller.setAdminApproved(false);
            seller.setStatus(SellerStatus.SUSPENDED);
            log.warn("Seller {} rejected. Reason: {}", sellerId, request.rejectionReason());
        }

        sellerRepository.save(seller);
    }

}
