package com.syriamart.commercial.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SellerApprovalRequest(
        @NotNull String sellerId,
        @NotNull Boolean approved,
        @Size(max = 500) String rejectionReason,
        @Size(max = 100) String approvedByAdminName) {
}
