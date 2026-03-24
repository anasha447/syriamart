package com.syriamart.logistics.service.impl;

import com.syriamart.logistics.dto.request.message.MessageSendRequest;
import com.syriamart.logistics.dto.response.message.MessageResponse;
import com.syriamart.logistics.mapper.MessageMapper;
import com.syriamart.logistics.model.Message;
import com.syriamart.logistics.repository.MessageRepository;
import com.syriamart.logistics.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepo;
    private final MessageMapper     messageMapper;

    @Override
    public MessageResponse send(String senderId, String senderRole, MessageSendRequest req) {
        Message msg = Message.builder()
                .senderId(senderId)
                .senderRole(senderRole)
                .receiverId(req.receiverId())
                .receiverRole(req.receiverRole())
                .orderId(req.orderId())
                .content(req.content())
                .attachmentUrl(req.attachmentUrl())
                .build();
        return messageMapper.toResponse(messageRepo.save(msg));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(String a, String b, Pageable pageable) {
        return messageMapper.toResponseList(
                messageRepo.findConversation(a, b, pageable).getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public long unreadCount(String receiverId) {
        return messageRepo.countByReceiverIdAndReadFalse(receiverId);
    }

    @Override
    public void markAllRead(String receiverId) {
        messageRepo.markAllReadForReceiver(receiverId);
    }
}
