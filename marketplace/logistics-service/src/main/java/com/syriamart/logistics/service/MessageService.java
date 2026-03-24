package com.syriamart.logistics.service;

import com.syriamart.logistics.dto.request.message.MessageSendRequest;
import com.syriamart.logistics.dto.response.message.MessageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {
    MessageResponse     send(String senderId, String senderRole, MessageSendRequest req);
    List<MessageResponse> getConversation(String participantA, String participantB, Pageable pageable);
    long                unreadCount(String receiverId);
    void                markAllRead(String receiverId);
}
