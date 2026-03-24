package com.syriamart.logistics.service.impl;

import com.syriamart.common.event.ReturnRequestedEvent;
import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.logistics.model.ReturnRequest;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import com.syriamart.logistics.repository.ReturnRequestRepository;
import com.syriamart.logistics.service.ReturnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReturnServiceImpl implements ReturnService {

    private final ReturnRequestRepository returnRepo;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public ReturnRequest createReturn(String customerId, String orderItemId, String orderId,
                                      String reason, String proofUrl) {
        if (returnRepo.existsByOrderItemId(orderItemId)) {
            throw new IllegalStateException("A return request already exists for this order item.");
        }
        ReturnRequest rr = ReturnRequest.builder()
                .customerId(customerId)
                .orderItemId(orderItemId)
                .orderId(orderId)
                .reason(reason)
                .proofImageUrl(proofUrl)
                .status(ReturnRequestStatus.PENDING)
                .build();
        rr = returnRepo.save(rr);
        eventPublisher.publishEvent(new ReturnRequestedEvent(orderId, orderItemId, customerId, reason));
        log.info("Return request created: orderItem={} customer={}", orderItemId, customerId);
        return rr;
    }

    @Override
    public ReturnRequest approveReturn(String returnId, String adminId, BigDecimal refundAmount) {
        ReturnRequest rr = getReturn(returnId);
        assertStatus(rr, ReturnRequestStatus.PENDING);
        rr.setStatus(ReturnRequestStatus.APPROVED);
        rr.setRefundAmount(refundAmount);
        rr.setAdminNotes("Approved by admin: " + adminId);
        rr.setPickupScheduledAt(LocalDateTime.now().plusDays(1));
        return returnRepo.save(rr);
    }

    @Override
    public ReturnRequest rejectReturn(String returnId, String adminId, String reason) {
        ReturnRequest rr = getReturn(returnId);
        assertStatus(rr, ReturnRequestStatus.PENDING);
        rr.setStatus(ReturnRequestStatus.REJECTED);
        rr.setAdminNotes("Rejected by admin: " + adminId + " — " + reason);
        return returnRepo.save(rr);
    }

    @Override
    public ReturnRequest assignDriver(String returnId, String driverId) {
        ReturnRequest rr = getReturn(returnId);
        assertStatus(rr, ReturnRequestStatus.APPROVED);
        rr.setAssignedDriverId(driverId);
        return returnRepo.save(rr);
    }

    @Override
    public ReturnRequest markPickedUp(String returnId, String driverId) {
        ReturnRequest rr = getReturn(returnId);
        if (!driverId.equals(rr.getAssignedDriverId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "This return is not assigned to you.");
        }
        rr.setStatus(ReturnRequestStatus.PICKED_UP);
        rr.setPickedUpAt(LocalDateTime.now());
        return returnRepo.save(rr);
    }

    @Override
    public ReturnRequest markReceivedAtWarehouse(String returnId, String staffId) {
        ReturnRequest rr = getReturn(returnId);
        rr.setStatus(ReturnRequestStatus.RECEIVED_AT_WAREHOUSE);
        rr.setReceivedAtWarehouseAt(LocalDateTime.now());
        return returnRepo.save(rr);
    }

    @Override
    public ReturnRequest initiateRefund(String returnId, String adminId) {
        ReturnRequest rr = getReturn(returnId);
        assertStatus(rr, ReturnRequestStatus.RECEIVED_AT_WAREHOUSE);
        rr.setStatus(ReturnRequestStatus.REFUND_INITIATED);
        rr.setRefundInitiatedAt(LocalDateTime.now());
        return returnRepo.save(rr);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnRequest> getCustomerReturns(String customerId, Pageable pageable) {
        return returnRepo.findByCustomerId(customerId, pageable).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnRequest> getByStatus(ReturnRequestStatus status, Pageable pageable) {
        return returnRepo.findByStatus(status, pageable).getContent();
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnRequest getById(String returnId) {
        return getReturn(returnId);
    }

    private ReturnRequest getReturn(String id) {
        return returnRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnRequest", id));
    }

    private void assertStatus(ReturnRequest rr, ReturnRequestStatus expected) {
        if (rr.getStatus() != expected) {
            throw new IllegalStateException(
                    "Expected status " + expected + " but found: " + rr.getStatus());
        }
    }
}
