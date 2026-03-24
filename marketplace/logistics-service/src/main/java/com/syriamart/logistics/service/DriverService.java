package com.syriamart.logistics.service;

import com.syriamart.logistics.dto.request.driver.*;
import com.syriamart.logistics.dto.response.driver.*;

import java.util.List;

public interface DriverService {

    // Admin
    DriverProfileResponse registerDriver(String adminId, com.syriamart.logistics.dto.request.admin.DriverRegistrationRequest req);
    void suspendDriver(String driverId);
    void activateDriver(String driverId);
    List<DriverInfoResponse> findAll(int page, int size);
    List<DriverInfoResponse> findByStatus(com.syriamart.logistics.model.enums.DriverStatus status);

    // Auth (driver-facing login returns a JWT)
    String login(DriverLoginRequest req);

    // Driver self-service
    DriverProfileResponse getMyProfile(String driverId);
    DriverProfileResponse updateMyProfile(String driverId, DriverProfileUpdateRequest req);
    void updateStatus(String driverId, DriverStatusUpdateRequest req);
    void updateLocation(String driverId, DriverLocationUpdateRequest req);

    // Scan workflow
    ScanConfirmationResponse scanPackage(String driverId, ScanPackageRequest req);
    ScanConfirmationResponse submitDeliveryProof(String driverId, String orderId, DeliveryProofRequest req);

    // Assignments & route
    List<AssignedOrderResponse> getMyActiveOrders(String driverId);
    DeliveryRouteResponse optimizeRoute(String driverId, RouteOptimizationRequest req);

    // Shift
    ShiftSummaryResponse startShift(String driverId);
    ShiftSummaryResponse endShift(String driverId);
    ShiftSummaryResponse getCurrentShift(String driverId);

    // Dashboard
    DriverDashboardResponse getMyDashboard(String driverId);
    DriverPerformanceResponse getPerformance(String driverId);
    PayoutResponse getPayoutInfo(String driverId);
}
