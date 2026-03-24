package com.syriamart.logistics.service;

import com.syriamart.logistics.model.ReturnRequest;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ReturnService {
    ReturnRequest createReturn(String customerId, String orderItemId, String orderId, String reason, String proofUrl);
    ReturnRequest approveReturn(String returnId, String adminId, BigDecimal refundAmount);
    ReturnRequest rejectReturn(String returnId, String adminId, String reason);
    ReturnRequest assignDriver(String returnId, String driverId);
    ReturnRequest markPickedUp(String returnId, String driverId);
    ReturnRequest markReceivedAtWarehouse(String returnId, String staffId);
    ReturnRequest initiateRefund(String returnId, String adminId);

    List<ReturnRequest> getCustomerReturns(String customerId, Pageable pageable);
    List<ReturnRequest> getByStatus(ReturnRequestStatus status, Pageable pageable);
    ReturnRequest getById(String returnId);
}
