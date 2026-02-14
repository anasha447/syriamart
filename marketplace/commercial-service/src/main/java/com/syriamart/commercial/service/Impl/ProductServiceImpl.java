package com.syriamart.commercial.service.Impl;

import com.syriamart.commercial.dto.request.product.ProductCreateRequest;
import com.syriamart.commercial.dto.response.product.ProductDetailResponse;
import com.syriamart.commercial.dto.response.product.ProductListResponse;
import com.syriamart.commercial.mapper.ProductMapper;
import com.syriamart.commercial.model.Product;
import com.syriamart.commercial.model.SubCategory;
import com.syriamart.commercial.repository.ProductRepository;
import com.syriamart.commercial.repository.SubCategoryRepository;
import com.syriamart.commercial.service.ProductService;
import com.syriamart.common.dto.PageResponse;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ProductMapper productMapper;

    @Override
    public PageResponse<ProductListResponse> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductListResponse> content = productPage.stream()
                .map(productMapper::toListResponse)
                .toList();
        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(),
                productPage.getTotalElements(), productPage.getTotalPages(), productPage.isFirst(), productPage.isLast());
    }

    @Override
    public ProductDetailResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public ProductDetailResponse createProduct(ProductCreateRequest request, String sellerIdOrEmail) {
        SubCategory subCategory = subCategoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = productMapper.toEntity(request);
        product.setSubCategory(subCategory);
        // TODO: Verify seller existence and set sellerId correctly using Feign Client
        product.setSellerId(sellerIdOrEmail);

        Product savedProduct = productRepository.save(product);
        return productMapper.toDetailResponse(savedProduct);
    }
}
