package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.request.review.ReviewSubmitRequest;
import com.syriamart.commercial.dto.response.review.ReviewResponse;
import com.syriamart.commercial.model.Review;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(config = MapperConfigData.class, componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true) // Authenticated user
    @Mapping(target = "approved", constant = "false")
    @Mapping(target = "product", ignore = true) // Handled by service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Review toEntity(ReviewSubmitRequest request);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userName", ignore = true) // Fetch from user-service
    @Mapping(target = "isApproved", source = "approved")
    ReviewResponse toResponse(Review review);
}
