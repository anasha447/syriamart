package com.syriamart.logistics.config;

import com.syriamart.common.event.DeliveryCompletedEvent;
import com.syriamart.common.event.OrderCancelledEvent;
import com.syriamart.common.event.OrderCreatedEvent;
import com.syriamart.common.event.ReturnRequestedEvent;
import com.syriamart.logistics.model.OrderStatusHistory;
import com.syriamart.logistics.model.ReturnRequest;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import com.syriamart.logistics.repository.OrderStatusHistoryRepository;
import com.syriamart.logistics.repository.ReturnRequestRepository;
import com.syriamart.common.model.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Listens to domain events published by commercial-service (and internally).
 *
 * In a real distributed setup these would be Kafka @KafkaListener methods.
 * Using Spring's ApplicationEventPublisher here keeps the code testable and
 * framework-agnostic — swapping to Kafka only requires changing the annotations.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventListenerConfig {

    private final OrderStatusHistoryRepository historyRepo;
    private final ReturnRequestRepository      returnRepo;

    /**
     * When commercial-service creates an order, seed the logistics status history
     * so tracking can immediately show PENDING even before the package arrives.
     */
    @EventListener
    @Async
    @Transactional
    public void onOrderCreated(OrderCreatedEvent event) {
        if (historyRepo.existsByOrderIdAndNewStatus(event.orderId(), OrderStatus.PENDING)) {
            return; // idempotent guard
        }
        historyRepo.save(OrderStatusHistory.builder()
                .orderId(event.orderId())
                .previousStatus(null)
                .newStatus(OrderStatus.PENDING)
                .changedByRole("SYSTEM")
                .changedById("commercial-service")
                .notes("Order created — awaiting seller handoff to warehouse.")
                .changedAt(LocalDateTime.now())
                .build());
        log.info("Logistics history seeded for new order: {}", event.orderId());
    }

    /**
     * When commercial-service cancels an order, close the logistics tracking timeline.
     */
    @EventListener
    @Async
    @Transactional
    public void onOrderCancelled(OrderCancelledEvent event) {
        historyRepo.save(OrderStatusHistory.builder()
                .orderId(event.orderId())
                .previousStatus(OrderStatus.PENDING)
                .newStatus(OrderStatus.CANCELLED)
                .changedByRole("SYSTEM")
                .changedById("commercial-service")
                .notes("Order cancelled by customer or system.")
                .changedAt(LocalDateTime.now())
                .build());
        log.info("Logistics history closed (cancelled) for order: {}", event.orderId());
    }

    /**
     * When a return is requested via commercial-service, ensure a logistics
     * ReturnRequest record is present (idempotent — may already exist if
     * created directly through this service).
     */
    @EventListener
    @Async
    @Transactional
    public void onReturnRequested(ReturnRequestedEvent event) {
        if (returnRepo.existsByOrderItemId(event.orderItemId())) {
            return;
        }
        returnRepo.save(ReturnRequest.builder()
                .orderId(event.orderId())
                .orderItemId(event.orderItemId())
                .customerId(event.customerId())
                .reason(event.reason())
                .status(ReturnRequestStatus.PENDING)
                .build());
        log.info("Return request synced from commercial-service: orderItem={}", event.orderItemId());
    }

    /**
     * Internal — fired by DriverServiceImpl.submitDeliveryProof().
     * Just logs; the actual status update already happened in the service.
     */
    @EventListener
    @Async
    public void onDeliveryCompleted(DeliveryCompletedEvent event) {
        log.info("Delivery completed event received: orderId={} driverId={}",
                event.orderId(), event.actorId());
    }
}
