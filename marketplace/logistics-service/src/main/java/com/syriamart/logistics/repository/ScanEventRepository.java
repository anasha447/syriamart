package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.ScanEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanEventRepository extends JpaRepository<ScanEvent, String> {
    List<ScanEvent> findByOrderIdOrderByScannedAtDesc(String orderId);
}