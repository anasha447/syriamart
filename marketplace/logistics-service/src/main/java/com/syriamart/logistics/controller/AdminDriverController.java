package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.request.admin.DriverRegistrationRequest;
import com.syriamart.logistics.dto.response.driver.DriverInfoResponse;
import com.syriamart.logistics.dto.response.driver.DriverProfileResponse;
import com.syriamart.logistics.model.enums.DriverStatus;
import com.syriamart.logistics.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/drivers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<DriverProfileResponse> register(
            @AuthenticationPrincipal UserDetails admin,
            @Valid @RequestBody DriverRegistrationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driverService.registerDriver(admin.getUsername(), req));
    }

    @GetMapping
    public ResponseEntity<List<DriverInfoResponse>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(driverService.findAll(page, size));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DriverInfoResponse>> listByStatus(
            @PathVariable DriverStatus status) {
        return ResponseEntity.ok(driverService.findByStatus(status));
    }

    @PostMapping("/{driverId}/suspend")
    public ResponseEntity<Void> suspend(@PathVariable String driverId) {
        driverService.suspendDriver(driverId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{driverId}/activate")
    public ResponseEntity<Void> activate(@PathVariable String driverId) {
        driverService.activateDriver(driverId);
        return ResponseEntity.noContent().build();
    }
}
