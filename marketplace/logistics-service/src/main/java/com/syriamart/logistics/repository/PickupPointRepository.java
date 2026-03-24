package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.PickupPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PickupPointRepository extends JpaRepository<PickupPoint, String> {
    List<PickupPoint> findByCityAndActiveTrue(String city);
    List<PickupPoint> findByActiveTrue();

    /** Pickup points that still have capacity. */
    List<PickupPoint> findByCityAndActiveTrueAndCurrentOccupancyLessThanMaxCapacity(String city);
}
