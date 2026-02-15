package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;

public interface SellerService {
    SellerDetailResponse updateSellerProfile(String sellerId, SellerProfileUpdateRequest request);
    void approveSeller(String sellerId, SellerApprovalRequest request);
}
