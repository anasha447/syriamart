package com.syriamart.logistics.model.enums;

/**
 * Identifies what kind of logistics scan occurred.
 *
 * INBOUND_WAREHOUSE   – Package arrived at the warehouse.
 * OUTBOUND_WAREHOUSE  – Package dispatched from the warehouse to a driver.
 * DRIVER_PICKUP       – Driver confirmed collection from warehouse / seller.
 * IN_TRANSIT          – Mid-route scan (checkpoint / hub transfer).
 * DELIVERED           – Final delivery scan at customer's address.
 * PICKUP_POINT_DROP   – Package deposited at a pickup-point locker.
 * RETURN_INITIATED    – Customer or driver initiated a return scan.
 * RETURN_RECEIVED     – Returned package arrived back at warehouse.
 */
public enum ScanEventType {
    INBOUND_WAREHOUSE,
    OUTBOUND_WAREHOUSE,
    DRIVER_PICKUP,
    IN_TRANSIT,
    DELIVERED,
    PICKUP_POINT_DROP,
    RETURN_INITIATED,
    RETURN_RECEIVED
}
