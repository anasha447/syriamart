package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import java.util.List;

public interface SellerService {
    // Existing methods
    SellerDetailResponse updateSellerProfile(String sellerId, SellerProfileUpdateRequest request);
    void approveSeller(String sellerId, SellerApprovalRequest request);

    // New methods to add
    SellerDetailResponse getSellerProfile(String sellerId);
    List<SellerDetailResponse> getPendingSellers();
    List<SellerDetailResponse> getActiveSellers();
    List<SellerDetailResponse> getAllSellers();
}