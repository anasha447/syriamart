package com.syriamart.commercial.dto.response.admin;

import com.syriamart.commercial.dto.response.customer.AddressResponse;
import com.syriamart.commercial.dto.response.seller.SellerAnalyticsResponse;
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
        SellerAnalyticsResponse analytics,
        LocalDateTime createdAt,
        LocalDateTime lastLogin) {
}
