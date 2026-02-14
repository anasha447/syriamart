package com.syriamart.userservice.dto.response.seller;

import com.syriamart.userservice.dto.response.address.AddressResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerDetailResponse(
        String id,
        String name,
        String email,
        String phone,
        String status,
        boolean adminApproved,
        String approvedByAdminName,
        LocalDateTime approvedAt,
        BigDecimal profitPercentage,
        String profileImageUrl,
        AddressResponse address,
        LocalDateTime createdAt,
        LocalDateTime lastLogin) {
}
