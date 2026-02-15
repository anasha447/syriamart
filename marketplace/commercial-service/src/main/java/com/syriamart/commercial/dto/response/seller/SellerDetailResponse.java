package com.syriamart.commercial.dto.response.seller;

import com.syriamart.commercial.dto.response.address.AddressResponse;
import com.syriamart.commercial.dto.response.dashboard.SellerAnalyticsResponse;
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
