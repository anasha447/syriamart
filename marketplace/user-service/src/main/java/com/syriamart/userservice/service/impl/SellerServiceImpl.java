package com.syriamart.userservice.service.impl;

import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.mapper.SellerMapper;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final SellerMapper sellerMapper;

    @Override
    @Transactional
    public SellerDetailResponse updateSellerProfile(String sellerId, SellerProfileUpdateRequest request) {
        log.info("Updating profile for seller: {}", sellerId);
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));

        sellerMapper.updateSellerFromRequest(seller, request);
        Seller savedSeller = sellerRepository.save(seller);

        return sellerMapper.toResponse(savedSeller);
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
            log.info("Seller {} approved by {}.", sellerId, request.approvedByAdminName());
        } else {
            seller.setAdminApproved(false);
            // Depending on business logic, rejected might mean SUSPENDED or remain PENDING with a note.
            // Here we assume it stays in PENDING or similar if rejected, or could have a REJECTED status if added.
            // Using SUSPENDED or keeping PENDING as per current enum capabilities.
            // Let's assume rejection just ensures it's not approved/active.
            log.warn("Seller {} rejected by {}. Reason: {}", sellerId, request.approvedByAdminName(), request.rejectionReason());
        }

        sellerRepository.save(seller);
    }
}
