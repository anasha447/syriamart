package com.syriamart.commercial.mapper;

import com.syriamart.commercial.dto.response.product.ProductDetailResponse;
import com.syriamart.commercial.dto.response.product.ProductSummaryResponse;
import com.syriamart.commercial.model.Product;
import com.syriamart.common.mapper.MapperConfigData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.List;

@Mapper(config = MapperConfigData.class,
        uses = {ProductImageMapper.class, ProductVariationMapper.class})
public interface ProductMapper {

    @Mapping(target = "primaryImageUrl",
             expression = "java( product.getImages().stream().filter(i -> i.isPrimary()).map(i -> i.getUrl()).findFirst().orElse(null) )")
    @Mapping(target = "effectivePrice", expression = "java( effectivePrice )")
    @Mapping(target = "categoryId", source = "product.category.id")
    ProductSummaryResponse toSummary(Product product, BigDecimal effectivePrice);

    @Mapping(target = "categoryId",    source = "category.id")
    @Mapping(target = "subCategoryId", source = "subCategory.id")
    ProductDetailResponse toDetail(Product product);

    List<ProductSummaryResponse> toSummaryList(List<Product> products);
}
