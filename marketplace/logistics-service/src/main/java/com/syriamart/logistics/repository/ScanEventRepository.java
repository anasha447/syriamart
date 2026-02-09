package com.syriamart.project.repository;

import com.syriamart.project.model.ScanEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanEventRepository extends JpaRepository<ScanEvent, String> {
    List<ScanEvent> findByOrderIdOrderByScannedAtDesc(String orderId);
}