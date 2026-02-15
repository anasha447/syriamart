package com.syriamart.userservice.dto.response.seller;

import com.syriamart.userservice.dto.response.address.AddressResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SellerDetailResponse(
        String id,
        String name,
        String email,
        String phone,
        String storeName,
        String storeLocation,
        String productType,
        String status,
        boolean adminApproved,
        String approvedByAdminName,
        LocalDateTime approvedAt,
        BigDecimal profitPercentage,
        String profileImageUrl,
        List<AddressResponse> addresses,
        LocalDateTime createdAt,
        LocalDateTime lastLogin) {
}
