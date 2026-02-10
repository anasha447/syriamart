package com.syriamart.logistics.model;

import com.syriamart.common.model.BaseEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(onlyExplicitlyIncluded = true, callSuper = true)
@SQLRestriction("deleted = false")
public class Message extends BaseEntity {

    @ToString.Include
    private String senderId;

    @ToString.Include
    private String receiverId;

    private String content;

    @Column(name = "order_id")
    @ToString.Include
    private String orderId;
}
