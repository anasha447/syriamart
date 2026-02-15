package com.syriamart.logistics.mapper;

import com.syriamart.logistics.dto.request.message.MessageSendRequest;
import com.syriamart.logistics.dto.response.message.MessageResponse;
import com.syriamart.logistics.model.Message;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "senderId", ignore = true) // Set by service (authenticated user)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Message toEntity(MessageSendRequest request);

    @Mapping(target = "senderName", ignore = true) // Needs enrichment
    @Mapping(target = "receiverName", ignore = true) // Needs enrichment
    @Mapping(target = "isRead", constant = "false") // Entity missing isRead
    @Mapping(target = "sentAt", source = "createdAt")
    MessageResponse toResponse(Message message);
}
