package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.request.pickuppoint.PickupPointCreateRequest;
import com.syriamart.logistics.dto.response.pickuppoint.PickupPointResponse;
import com.syriamart.logistics.service.PickupPointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-points")
@RequiredArgsConstructor
public class PickupPointController {

    private final PickupPointService pickupPointService;

    @GetMapping
    public ResponseEntity<List<PickupPointResponse>> all() {
        return ResponseEntity.ok(pickupPointService.findAll());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<PickupPointResponse>> byCity(@PathVariable String city) {
        return ResponseEntity.ok(pickupPointService.findByCity(city));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PickupPointResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(pickupPointService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PickupPointResponse> create(@Valid @RequestBody PickupPointCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pickupPointService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PickupPointResponse> update(
            @PathVariable String id,
            @Valid @RequestBody PickupPointCreateRequest req) {
        return ResponseEntity.ok(pickupPointService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        pickupPointService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
