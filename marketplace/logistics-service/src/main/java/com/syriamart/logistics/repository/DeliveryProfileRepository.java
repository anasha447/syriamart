package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.Driver;
import com.syriamart.logistics.model.enums.DriverStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Named DeliveryProfileRepository per the spec; it owns the Driver entity
 * (which IS the delivery profile at the identity level).
 */
public interface DeliveryProfileRepository extends JpaRepository<Driver, String> {

    Optional<Driver> findByEmail(String email);
    Optional<Driver> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Page<Driver>  findByStatus(DriverStatus status, Pageable pageable);
    List<Driver>  findByStatusAndActiveTrue(DriverStatus status);
    Page<Driver>  findByActiveTrue(Pageable pageable);

    long countByStatus(DriverStatus status);
    long countByActiveTrue();

    @Modifying
    @Query("UPDATE Driver d SET d.status = :status WHERE d.id = :id")
    void updateStatus(@Param("id") String id, @Param("status") DriverStatus status);

    @Modifying
    @Query("""
           UPDATE Driver d
           SET d.currentLatitude = :lat, d.currentLongitude = :lng,
               d.lastLocationUpdate = :ts
           WHERE d.id = :id
           """)
    void updateLocation(@Param("id") String id,
                        @Param("lat") double lat,
                        @Param("lng") double lng,
                        @Param("ts") LocalDateTime ts);

    /** Find available drivers near a coordinate for dispatch. */
    @Query("""
           SELECT d FROM Driver d
           WHERE d.status = 'AVAILABLE' AND d.active = true
             AND d.currentLatitude  IS NOT NULL
             AND d.currentLongitude IS NOT NULL
             AND ABS(d.currentLatitude  - :lat) < :radiusDeg
             AND ABS(d.currentLongitude - :lng) < :radiusDeg
           """)
    List<Driver> findNearbyAvailable(@Param("lat") double lat,
                                     @Param("lng") double lng,
                                     @Param("radiusDeg") double radiusDeg);
}
