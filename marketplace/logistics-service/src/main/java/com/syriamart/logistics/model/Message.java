package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * In-app message between a driver and an admin dispatcher.
 *
 * Both senderId and receiverId are UUIDs. The role suffix
 * (senderRole / receiverRole) identifies which service context they
 * belong to: "DRIVER" means this service; "ADMIN" means user-service.
 */
@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_msg_sender",   columnList = "sender_id"),
        @Index(name = "idx_msg_receiver", columnList = "receiver_id"),
        @Index(name = "idx_msg_order",    columnList = "order_id"),
        @Index(name = "idx_msg_read",     columnList = "is_read")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    @Column(name = "sender_id", nullable = false, length = 36)
    private String senderId;

    @Column(name = "sender_role", nullable = false, length = 15)
    private String senderRole;   // "DRIVER" | "ADMIN"

    @Column(name = "receiver_id", nullable = false, length = 36)
    private String receiverId;

    @Column(name = "receiver_role", nullable = false, length = 15)
    private String receiverRole; // "DRIVER" | "ADMIN"

    /** Nullable — messages may be general or tied to a specific order. */
    @Column(name = "order_id", length = 36)
    private String orderId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean read = false;

    @Column(name = "read_at")
    private java.time.LocalDateTime readAt;

    /** URL of an optional image/attachment. */
    @Column(name = "attachment_url")
    private String attachmentUrl;
}
