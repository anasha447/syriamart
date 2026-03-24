package com.syriamart.logistics.dto.request.driver;

import com.syriamart.logistics.model.enums.ScanEventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Payload sent by the driver's mobile app when they physically scan a package.
 *
 * scanCode – the raw QR / barcode value read by the scanner.
 * orderId  – must be included (either embedded in QR or entered manually).
 * eventType– tells the system what kind of scan this is (pickup, delivery, etc.)
 */
public record ScanPackageRequest(
        @NotBlank String orderId,
        @NotBlank String scanCode,
        @NotNull  ScanEventType eventType,
        @NotBlank String location,
        Double latitude,
        Double longitude,
        String notes
) {}
