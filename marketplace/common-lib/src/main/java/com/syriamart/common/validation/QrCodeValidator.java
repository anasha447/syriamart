package com.syriamart.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class QrCodeValidator implements ConstraintValidator<ValidQrCode, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // Use @NotNull separately to enforce non-null
        }
        return value.matches("^QR-[A-Z0-9]{8}-[A-Z0-9]{4}$");
    }
}
