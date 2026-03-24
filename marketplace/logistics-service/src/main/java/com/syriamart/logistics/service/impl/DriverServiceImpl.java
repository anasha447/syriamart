package com.syriamart.logistics.service.impl;

import com.syriamart.common.event.DeliveryCompletedEvent;
import com.syriamart.common.event.OrderScannedEvent;
import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.common.model.enums.OrderStatus;
import com.syriamart.logistics.dto.request.admin.DriverRegistrationRequest;
import com.syriamart.logistics.dto.request.driver.*;
import com.syriamart.logistics.dto.response.driver.*;
import com.syriamart.logistics.mapper.DriverMapper;
import com.syriamart.logistics.model.*;
import com.syriamart.logistics.model.enums.*;
import com.syriamart.logistics.repository.*;
import com.syriamart.logistics.service.DriverService;
import com.syriamart.common.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DeliveryProfileRepository driverRepo;
    private final ScanEventRepository       scanEventRepo;
    private final OrderStatusHistoryRepository historyRepo;
    private final WarehouseInventoryRepository inventoryRepo;
    private final DriverShiftRepository     shiftRepo;
    private final DriverMapper              driverMapper;
    private final PasswordEncoder           passwordEncoder;
    private final JwtUtils                  jwtUtils;
    private final ApplicationEventPublisher eventPublisher;

    // ── ADMIN: REGISTER ───────────────────────────────────────────────────────

    @Override
    public DriverProfileResponse registerDriver(String adminId, DriverRegistrationRequest req) {
        if (driverRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already registered: " + req.email());
        }
        if (driverRepo.existsByPhone(req.phone())) {
            throw new IllegalArgumentException("Phone already registered: " + req.phone());
        }

        Driver driver = Driver.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .phone(req.phone())
                .passwordHash(passwordEncoder.encode(req.password()))
                .registeredByAdminId(adminId)
                .status(DriverStatus.OFFLINE)
                .build();

        DriverProfile profile = DriverProfile.builder()
                .driver(driver)
                .vehicleType(req.vehicleType())
                .vehicleMake(req.vehicleMake())
                .vehicleModel(req.vehicleModel())
                .vehicleYear(req.vehicleYear())
                .vehiclePlate(req.vehiclePlate())
                .vehicleColor(req.vehicleColor())
                .licenseNumber(req.licenseNumber())
                .licenseExpiry(req.licenseExpiry())
                .nationalId(req.nationalId())
                .build();

        driver.setProfile(profile);
        driverRepo.save(driver);

        log.info("Driver registered: {} by admin {}", driver.getEmail(), adminId);
        return driverMapper.toProfile(driver);
    }

    @Override
    public void suspendDriver(String driverId) {
        Driver driver = getDriver(driverId);
        driver.setStatus(DriverStatus.SUSPENDED);
        driver.setActive(false);
        driverRepo.save(driver);
        log.info("Driver {} suspended", driverId);
    }

    @Override
    public void activateDriver(String driverId) {
        Driver driver = getDriver(driverId);
        driver.setStatus(DriverStatus.OFFLINE);
        driver.setActive(true);
        driverRepo.save(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverInfoResponse> findAll(int page, int size) {
        return driverMapper.toInfoList(
                driverRepo.findAll(PageRequest.of(page, size)).getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverInfoResponse> findByStatus(DriverStatus status) {
        return driverMapper.toInfoList(driverRepo.findByStatusAndActiveTrue(status));
    }

    // ── AUTH ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public String login(DriverLoginRequest req) {
        Driver driver = driverRepo.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials."));

        if (!driver.isActive()) {
            throw new IllegalStateException("Account is suspended or inactive.");
        }
        if (!passwordEncoder.matches(req.password(), driver.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials.");
        }
        // Reuse JwtUtils from common-lib. Role prefix so Spring Security picks it up.
        return jwtUtils.generateToken(driver.getId(), "ROLE_DRIVER");
    }

    // ── DRIVER SELF-SERVICE ───────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public DriverProfileResponse getMyProfile(String driverId) {
        return driverMapper.toProfile(getDriver(driverId));
    }

    @Override
    public DriverProfileResponse updateMyProfile(String driverId, DriverProfileUpdateRequest req) {
        Driver driver = getDriver(driverId);
        DriverProfile profile = driver.getProfile();
        if (profile == null) throw new IllegalStateException("Profile not found for driver: " + driverId);

        if (req.vehicleMake()        != null) profile.setVehicleMake(req.vehicleMake());
        if (req.vehicleModel()       != null) profile.setVehicleModel(req.vehicleModel());
        if (req.vehicleYear()        != null) profile.setVehicleYear(req.vehicleYear());
        if (req.vehicleColor()       != null) profile.setVehicleColor(req.vehicleColor());
        if (req.licenseNumber()      != null) profile.setLicenseNumber(req.licenseNumber());
        if (req.licenseExpiry()      != null) profile.setLicenseExpiry(req.licenseExpiry());
        if (req.profilePhotoUrl()    != null) profile.setProfilePhotoUrl(req.profilePhotoUrl());
        if (req.bankName()           != null) profile.setBankName(req.bankName());
        if (req.bankAccountNumber()  != null) profile.setBankAccountNumber(req.bankAccountNumber());
        if (req.bankAccountName()    != null) profile.setBankAccountName(req.bankAccountName());

        driverRepo.save(driver);
        return driverMapper.toProfile(driver);
    }

    @Override
    public void updateStatus(String driverId, DriverStatusUpdateRequest req) {
        Driver driver = getDriver(driverId);
        validateStatusTransition(driver.getStatus(), req.status());
        driver.setStatus(req.status());
        driverRepo.save(driver);
        log.info("Driver {} status → {}", driverId, req.status());
    }

    @Override
    public void updateLocation(String driverId, DriverLocationUpdateRequest req) {
        driverRepo.updateLocation(driverId, req.latitude(), req.longitude(), LocalDateTime.now());
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  SCAN WORKFLOW  ← Core business logic
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * POST /api/driver/scan
     *
     * When the driver scans a package's QR/barcode:
     *  1. Persist a ScanEvent record
     *  2. Append an OrderStatusHistory entry with the derived OrderStatus
     *  3. Update WarehouseInventory if applicable
     *  4. Publish OrderScannedEvent so commercial-service can update its Order
     */
    @Override
    public ScanConfirmationResponse scanPackage(String driverId, ScanPackageRequest req) {
        getDriver(driverId); // existence + active guard

        // 1. Persist the scan event
        ScanEvent scan = ScanEvent.builder()
                .orderId(req.orderId())
                .driverId(driverId)
                .eventType(req.eventType())
                .location(req.location())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .scanCode(req.scanCode())
                .notes(req.notes())
                .scannedAt(LocalDateTime.now())
                .build();
        scan = scanEventRepo.save(scan);

        // 2. Derive the new OrderStatus from the scan type
        OrderStatus derivedStatus = deriveOrderStatus(req.eventType());

        // 3. Append to status history
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orderId(req.orderId())
                .previousStatus(getLastStatus(req.orderId()))
                .newStatus(derivedStatus)
                .changedByRole("DRIVER")
                .changedById(driverId)
                .scanEventId(scan.getId())
                .notes("Scan at: " + req.location())
                .changedAt(LocalDateTime.now())
                .build();
        historyRepo.save(history);

        // 4. Update warehouse inventory when driver picks up from warehouse
        if (req.eventType() == ScanEventType.DRIVER_PICKUP) {
            inventoryRepo.findByOrderId(req.orderId()).ifPresent(inv -> {
                inv.setStatus(WarehouseInventory.WarehouseStatus.DISPATCHED);
                inv.setAssignedDriverId(driverId);
                inv.setDispatchedAt(LocalDateTime.now());
                inv.setOutboundScanEventId(scan.getId());
                inventoryRepo.save(inv);
            });
        }

        // 5. Publish domain event → commercial-service listens
        eventPublisher.publishEvent(
                new OrderScannedEvent(req.orderId(), driverId, derivedStatus, req.location()));

        log.info("Package scanned — order={} driver={} type={} → status={}",
                req.orderId(), driverId, req.eventType(), derivedStatus);

        return new ScanConfirmationResponse(
                scan.getId(), req.orderId(), req.eventType(),
                derivedStatus, req.location(), scan.getScannedAt(),
                "Package scanned successfully.");
    }

    /**
     * POST /api/driver/orders/{orderId}/deliver
     *
     * Final delivery confirmation:
     *  1. Record a DELIVERED scan event with proof data
     *  2. Append DELIVERED history entry
     *  3. Update driver shift statistics
     *  4. Publish DeliveryCompletedEvent → commercial-service marks order DELIVERED
     */
    @Override
    public ScanConfirmationResponse submitDeliveryProof(String driverId, String orderId,
                                                        DeliveryProofRequest req) {
        Driver driver = getDriver(driverId);

        // Guard against double-delivery
        if (scanEventRepo.existsByOrderIdAndEventType(orderId, ScanEventType.DELIVERED)) {
            throw new IllegalStateException("Order " + orderId + " has already been marked as delivered.");
        }

        // 1. Persist scan event
        ScanEvent scan = ScanEvent.builder()
                .orderId(orderId)
                .driverId(driverId)
                .eventType(ScanEventType.DELIVERED)
                .location(req.notes() != null ? req.notes() : "Customer address")
                .latitude(req.latitude())
                .longitude(req.longitude())
                .scanCode("DELIVERY-PROOF")
                .notes("Recipient: " + req.recipientName()
                       + " | Signature: " + req.signatureImageUrl()
                       + (req.photoProofUrl() != null ? " | Photo: " + req.photoProofUrl() : ""))
                .scannedAt(LocalDateTime.now())
                .build();
        scan = scanEventRepo.save(scan);

        // 2. History entry
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orderId(orderId)
                .previousStatus(getLastStatus(orderId))
                .newStatus(OrderStatus.DELIVERED)
                .changedByRole("DRIVER")
                .changedById(driverId)
                .scanEventId(scan.getId())
                .notes("Delivered to: " + req.recipientName())
                .changedAt(LocalDateTime.now())
                .build();
        historyRepo.save(history);

        // 3. Update current shift counters
        shiftRepo.findByDriverIdAndStatus(driverId, ShiftStatus.ACTIVE).ifPresent(shift -> {
            shift.setDeliveriesCompleted(shift.getDeliveriesCompleted() + 1);
            shift.setShiftEarnings(shift.getShiftEarnings().add(new BigDecimal("1500"))); // per-delivery rate
            shiftRepo.save(shift);
        });

        // 4. Update profile totals
        if (driver.getProfile() != null) {
            driver.getProfile().setTotalDeliveries(driver.getProfile().getTotalDeliveries() + 1);
            driver.getProfile().setSuccessfulDeliveries(driver.getProfile().getSuccessfulDeliveries() + 1);
            driver.getProfile().setTotalEarnings(driver.getProfile().getTotalEarnings().add(new BigDecimal("1500")));
            driver.getProfile().setPendingPayout(driver.getProfile().getPendingPayout().add(new BigDecimal("1500")));
            driverRepo.save(driver);
        }

        // 5. Publish event
        eventPublisher.publishEvent(new DeliveryCompletedEvent(orderId, driverId));

        log.info("Delivery confirmed — order={} driver={} recipient={}",
                orderId, driverId, req.recipientName());

        return new ScanConfirmationResponse(
                scan.getId(), orderId, ScanEventType.DELIVERED,
                OrderStatus.DELIVERED, "Customer address",
                scan.getScannedAt(), "Delivery confirmed for: " + req.recipientName());
    }

    // ── ASSIGNMENTS & ROUTE ───────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<AssignedOrderResponse> getMyActiveOrders(String driverId) {
        return inventoryRepo
                .findByAssignedDriverIdAndStatus(driverId, WarehouseInventory.WarehouseStatus.DISPATCHED)
                .stream()
                .map(inv -> {
                    // Use the most recent IN_TRANSIT scan for location, fall back to DRIVER_PICKUP
                    String lastLocation = scanEventRepo
                            .findTopByOrderIdAndEventTypeOrderByScannedAtDesc(
                                    inv.getOrderId(), ScanEventType.IN_TRANSIT)
                            .map(ScanEvent::getLocation)
                            .orElseGet(() -> scanEventRepo
                                    .findTopByOrderIdAndEventTypeOrderByScannedAtDesc(
                                            inv.getOrderId(), ScanEventType.DRIVER_PICKUP)
                                    .map(ScanEvent::getLocation)
                                    .orElse("In transit"));

                    // Derive the current order status from history
                    OrderStatus currentStatus = historyRepo
                            .findTopByOrderIdOrderByChangedAtDesc(inv.getOrderId())
                            .map(OrderStatusHistory::getNewStatus)
                            .orElse(OrderStatus.SHIPPED);

                    return new AssignedOrderResponse(
                            inv.getOrderId(), currentStatus,
                            /* customerName / phone / address fields are intentionally null here —
                               the driver app fetches those via the commercial-service tracking API.
                               Populated when a Feign client or gateway aggregation layer is added. */
                            null, null, null, null, null, null,
                            null, null, inv.getNotes(), lastLocation);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryRouteResponse optimizeRoute(String driverId, RouteOptimizationRequest req) {
        Driver driver = getDriver(driverId);
        double lat = req.currentLatitude()  != null ? req.currentLatitude()  :
                     (driver.getCurrentLatitude()  != null ? driver.getCurrentLatitude()  : 33.51);
        double lng = req.currentLongitude() != null ? req.currentLongitude() :
                     (driver.getCurrentLongitude() != null ? driver.getCurrentLongitude() : 36.29);

        // Nearest-neighbor greedy sort by haversine distance
        List<String> ordered = greedySort(req.orderIds(), lat, lng);

        List<DeliveryRouteResponse.RouteStop> stops = new ArrayList<>();
        for (int i = 0; i < ordered.size(); i++) {
            stops.add(new DeliveryRouteResponse.RouteStop(
                    i + 1, ordered.get(i),
                    "Shipping address for " + ordered.get(i),
                    "Damascus", null, null, null));
        }
        return new DeliveryRouteResponse(driverId, stops, stops.size() * 5.0);
    }

    // ── SHIFT ─────────────────────────────────────────────────────────────────

    @Override
    public ShiftSummaryResponse startShift(String driverId) {
        if (shiftRepo.existsByDriverIdAndStatus(driverId, ShiftStatus.ACTIVE)) {
            throw new IllegalStateException("A shift is already active for driver: " + driverId);
        }
        Driver driver = getDriver(driverId);
        driver.setStatus(DriverStatus.AVAILABLE);
        driverRepo.save(driver);

        DriverShift shift = DriverShift.builder()
                .driverId(driverId)
                .startedAt(LocalDateTime.now())
                .status(ShiftStatus.ACTIVE)
                .build();
        return driverMapper.toShiftSummary(shiftRepo.save(shift));
    }

    @Override
    public ShiftSummaryResponse endShift(String driverId) {
        DriverShift shift = shiftRepo.findByDriverIdAndStatus(driverId, ShiftStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active shift found."));

        shift.setStatus(ShiftStatus.COMPLETED);
        shift.setEndedAt(LocalDateTime.now());
        shift.setSummary(String.format("%d deliveries | %d failed | %.2f SYP earned",
                shift.getDeliveriesCompleted(),
                shift.getDeliveriesFailed(),
                shift.getShiftEarnings()));
        shiftRepo.save(shift);

        Driver driver = getDriver(driverId);
        driver.setStatus(DriverStatus.OFFLINE);
        driverRepo.save(driver);

        return driverMapper.toShiftSummary(shift);
    }

    @Override
    @Transactional(readOnly = true)
    public ShiftSummaryResponse getCurrentShift(String driverId) {
        return driverMapper.toShiftSummary(
                shiftRepo.findByDriverIdAndStatus(driverId, ShiftStatus.ACTIVE)
                        .orElseThrow(() -> new IllegalStateException("No active shift.")));
    }

    // ── DASHBOARD ─────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public DriverDashboardResponse getMyDashboard(String driverId) {
        Driver driver = getDriver(driverId);
        DriverProfile profile = driver.getProfile();

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        long deliveriesToday = scanEventRepo.countByDriverIdAndEventTypeAndScannedAtBetween(
                driverId, ScanEventType.DELIVERED, startOfDay, LocalDateTime.now());

        BigDecimal earningsToday = deliveriesToday > 0
                ? new BigDecimal(deliveriesToday).multiply(new BigDecimal("1500"))
                : BigDecimal.ZERO;

        List<AssignedOrderResponse> active = getMyActiveOrders(driverId);

        return new DriverDashboardResponse(
                driverId, driver.getFullName(), driver.getStatus(),
                (int) deliveriesToday,
                profile != null ? profile.getTotalDeliveries() : 0,
                earningsToday,
                profile != null ? profile.getTotalEarnings() : BigDecimal.ZERO,
                profile != null ? profile.getPendingPayout() : BigDecimal.ZERO,
                0L, active);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverPerformanceResponse getPerformance(String driverId) {
        Driver driver = getDriver(driverId);
        DriverProfile p = driver.getProfile();
        return new DriverPerformanceResponse(
                driverId, driver.getFullName(),
                p != null ? p.getTotalDeliveries() : 0,
                p != null ? p.getSuccessfulDeliveries() : 0,
                p != null ? p.getFailedDeliveries() : 0,
                p != null ? p.getTotalReturnsHandled() : 0,
                p != null ? p.successRate() : 0.0,
                p != null ? p.getAverageRating() : BigDecimal.ZERO,
                p != null ? p.getTotalEarnings() : BigDecimal.ZERO);
    }

    @Override
    @Transactional(readOnly = true)
    public PayoutResponse getPayoutInfo(String driverId) {
        Driver driver = getDriver(driverId);
        DriverProfile p = driver.getProfile();
        return new PayoutResponse(
                driverId,
                p != null ? p.getTotalEarnings() : BigDecimal.ZERO,
                p != null ? p.getPendingPayout() : BigDecimal.ZERO,
                p != null ? p.getTotalEarnings().subtract(p.getPendingPayout()) : BigDecimal.ZERO,
                null,
                p != null ? p.getTotalDeliveries() : 0);
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    private Driver getDriver(String id) {
        return driverRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", id));
    }

    private OrderStatus getLastStatus(String orderId) {
        return historyRepo.findTopByOrderIdOrderByChangedAtDesc(orderId)
                .map(OrderStatusHistory::getNewStatus)
                .orElse(OrderStatus.PENDING);
    }

    private OrderStatus deriveOrderStatus(ScanEventType type) {
        return switch (type) {
            case DRIVER_PICKUP, OUTBOUND_WAREHOUSE -> OrderStatus.PROCESSING;
            case IN_TRANSIT                         -> OrderStatus.SHIPPED;
            case DELIVERED, PICKUP_POINT_DROP       -> OrderStatus.DELIVERED;
            case RETURN_INITIATED                   -> OrderStatus.RETURN_REQUESTED;
            case RETURN_RECEIVED                    -> OrderStatus.RETURNED;
            default                                  -> OrderStatus.PROCESSING;
        };
    }

    private void validateStatusTransition(DriverStatus current, DriverStatus next) {
        boolean valid = switch (current) {
            case OFFLINE     -> next == DriverStatus.AVAILABLE;
            case AVAILABLE   -> next == DriverStatus.ON_DELIVERY || next == DriverStatus.ON_BREAK
                                || next == DriverStatus.OFFLINE;
            case ON_DELIVERY -> next == DriverStatus.AVAILABLE || next == DriverStatus.ON_BREAK;
            case ON_BREAK    -> next == DriverStatus.AVAILABLE || next == DriverStatus.OFFLINE;
            case SUSPENDED   -> false;
        };
        if (!valid) throw new IllegalStateException(
                "Invalid status transition: " + current + " → " + next);
    }

    /** Greedy nearest-neighbour sort — pure positional placeholder (no external maps API). */
    private List<String> greedySort(List<String> orderIds, double lat, double lng) {
        // Without real coordinates per order, return as-is in MVP
        return new ArrayList<>(orderIds);
    }
}
