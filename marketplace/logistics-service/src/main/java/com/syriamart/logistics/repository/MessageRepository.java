package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, String> {

    Page<Message> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(
            String senderId, String receiverId, Pageable pageable);

    @Query("""
           SELECT m FROM Message m
           WHERE ((m.senderId = :a AND m.receiverId = :b)
               OR (m.senderId = :b AND m.receiverId = :a))
           ORDER BY m.createdAt ASC
           """)
    Page<Message> findConversation(@Param("a") String participantA,
                                   @Param("b") String participantB,
                                   Pageable pageable);

    long countByReceiverIdAndReadFalse(String receiverId);

    @Modifying
    @Query("UPDATE Message m SET m.read = true, m.readAt = CURRENT_TIMESTAMP WHERE m.receiverId = :receiverId AND m.read = false")
    void markAllReadForReceiver(@Param("receiverId") String receiverId);
}
