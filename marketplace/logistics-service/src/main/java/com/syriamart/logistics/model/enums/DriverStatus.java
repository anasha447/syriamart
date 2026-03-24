package com.syriamart.logistics.model.enums;

/**
 * Represents the real-time operational state of a driver.
 *
 * OFFLINE        – Not logged into the app / end of shift.
 * AVAILABLE      – Logged in, no active assignment, ready for dispatch.
 * ON_DELIVERY    – Currently carrying one or more packages en route.
 * ON_BREAK       – Temporarily unavailable (short break).
 * SUSPENDED      – Administratively suspended; cannot receive assignments.
 */
public enum DriverStatus {
    OFFLINE,
    AVAILABLE,
    ON_DELIVERY,
    ON_BREAK,
    SUSPENDED
}
