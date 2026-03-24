package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.ReturnRequest;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, String> {
    Page<ReturnRequest>  findByCustomerId(String customerId, Pageable pageable);
    Page<ReturnRequest>  findByStatus(ReturnRequestStatus status, Pageable pageable);
    Optional<ReturnRequest> findByOrderItemId(String orderItemId);
    boolean existsByOrderItemId(String orderItemId);
    List<ReturnRequest>  findByAssignedDriverIdAndStatusIn(String driverId, List<ReturnRequestStatus> statuses);
}
