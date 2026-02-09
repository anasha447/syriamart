package com.syriamart.common.model.enums;

/**
 * Shared roles for the SyriaMart platform.
 * These must be exactly the same across all microservices.
 */
public enum UserRole {
    ADMIN,      // Platform management & approval
    SELLER,     // Store management & product uploads
    CUSTOMER,   // Shopping & profile management
    DRIVER      // Delivery & QR scanning (Logistics)
}