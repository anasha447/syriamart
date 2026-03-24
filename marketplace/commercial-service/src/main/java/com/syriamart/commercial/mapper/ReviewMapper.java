package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.review.ReviewResponse;
import com.syriamart.commercial.model.Review;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = MapperConfigData.class)
public interface ReviewMapper {

    @Mapping(target = "productId", source = "product.id")
    ReviewResponse toResponse(Review review);

    List<ReviewResponse> toResponseList(List<Review> reviews);
}
