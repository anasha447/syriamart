package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.DriverShift;
import com.syriamart.logistics.model.enums.ShiftStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverShiftRepository extends JpaRepository<DriverShift, String> {
    Optional<DriverShift> findByDriverIdAndStatus(String driverId, ShiftStatus status);
    Page<DriverShift>     findByDriverIdOrderByStartedAtDesc(String driverId, Pageable pageable);
    boolean existsByDriverIdAndStatus(String driverId, ShiftStatus status);
}
