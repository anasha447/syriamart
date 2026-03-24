package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.NotBlank;

/**
 * Submitted by the driver upon delivering a package to the customer.
 *
 * signatureImageUrl  – URL of the recipient's signature image (uploaded to CDN
 *                      before this request is sent).
 * recipientName      – Name as given by the recipient at the door.
 * photoProofUrl      – Optional photo of the package at the drop location.
 */
public record DeliveryProofRequest(
        @NotBlank String signatureImageUrl,
        @NotBlank String recipientName,
        String photoProofUrl,
        String notes,
        Double latitude,
        Double longitude
) {}
