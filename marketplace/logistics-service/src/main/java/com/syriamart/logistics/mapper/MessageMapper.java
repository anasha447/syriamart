package com.syriamart.logistics.mapper;

import com.syriamart.common.mapper.MapperConfigData;
import com.syriamart.logistics.dto.response.message.MessageResponse;
import com.syriamart.logistics.model.Message;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface MessageMapper {
    MessageResponse toResponse(Message message);
    List<MessageResponse> toResponseList(List<Message> messages);
}
