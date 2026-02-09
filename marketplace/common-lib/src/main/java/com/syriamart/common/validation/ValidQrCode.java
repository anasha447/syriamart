package com.syriamart.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = QrCodeValidator.class)
public @interface ValidQrCode {
    String message() default "Invalid QR code format (expected: QR-XXXXXXXX-XXXX)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
