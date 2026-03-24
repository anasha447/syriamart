package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.WarehouseInventory;
import com.syriamart.logistics.model.WarehouseInventory.WarehouseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Note: Ensure your actual filename is capitalized too: WarehouseInventoryRepository.java
public interface WarehouseInventoryRepository extends JpaRepository<WarehouseInventory, String> {

    Optional<WarehouseInventory> findByOrderId(String orderId);

    boolean existsByOrderId(String orderId);

    Page<WarehouseInventory> findByStatus(WarehouseStatus status, Pageable pageable);

    Page<WarehouseInventory> findBySellerId(String sellerId, Pageable pageable);

    long countByStatus(WarehouseStatus status);

    // FIX: This method is now safely INSIDE the interface!
    java.util.List<WarehouseInventory> findByAssignedDriverIdAndStatus(
            String driverId, WarehouseStatus status);
}