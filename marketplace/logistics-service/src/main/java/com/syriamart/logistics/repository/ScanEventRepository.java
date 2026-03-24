package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.ScanEvent;
import com.syriamart.logistics.model.enums.ScanEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScanEventRepository extends JpaRepository<ScanEvent, String> {

    /** All scan events for an order, ordered chronologically — feeds the tracking timeline. */
    List<ScanEvent> findByOrderIdOrderByScannedAtAsc(String orderId);

    Page<ScanEvent> findByDriverId(String driverId, Pageable pageable);
    Page<ScanEvent> findByDriverIdAndScannedAtBetween(String driverId,
                                                       LocalDateTime from,
                                                       LocalDateTime to,
                                                       Pageable pageable);

    Optional<ScanEvent> findTopByOrderIdAndEventTypeOrderByScannedAtDesc(String orderId,
                                                                          ScanEventType type);
    boolean existsByOrderIdAndEventType(String orderId, ScanEventType type);

    long countByDriverIdAndEventTypeAndScannedAtBetween(String driverId,
                                                         ScanEventType type,
                                                         LocalDateTime from,
                                                         LocalDateTime to);
}
