package com.syriamart.commercial.service.Impl; // Changed to lowercase 'impl' (standard)

import com.syriamart.commercial.dto.request.seller.ProductCreateRequest;
import com.syriamart.commercial.dto.request.seller.ProductUpdateRequest;
import com.syriamart.commercial.dto.response.seller.ProductDetailResponse;
import com.syriamart.commercial.dto.response.seller.ProductListResponse;
import com.syriamart.commercial.mapper.ProductMapper;
import com.syriamart.commercial.service.ProductService;
import com.syriamart.common.dto.PageResponse;
import com.syriamart.commercial.model.Product;
import com.syriamart.commercial.model.Seller;
import com.syriamart.commercial.model.SubCategory;
import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.commercial.repository.ProductRepository;
import com.syriamart.commercial.repository.SellerRepository;
import com.syriamart.commercial.repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductDetailResponse createProduct(ProductCreateRequest request, String sellerId) {
        // 1. Fetch related entities
        // Ensure SellerRepository imports com.syriamart.userservice.model.Seller
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // Ensure SubCategoryRepository imports com.syriamart.commercial.model.SubCategory
        SubCategory category = subCategoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 2. Map DTO to Entity
        Product product = productMapper.toEntity(request);

        // 3. Set ignored fields
        product.setId(UUID.randomUUID().toString());
        product.setSeller(seller);
        product.setSubCategory(category);
        product.setStatus(ProductStatus.PENDING_APPROVAL);
        product.setAdminApproved(false);

        // 4. Save and return
        Product savedProduct = productRepository.save(product);
        return productMapper.toDetailResponse(savedProduct);
    }

    @Override
    public ProductDetailResponse updateProduct(String id, ProductUpdateRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Manual updates from DTO to Entity
        if (request.name() != null) existing.setName(request.name());
        if (request.description() != null) existing.setDescription(request.description());
        if (request.price() != null) existing.setPrice(request.price());
        if (request.stock() != null) existing.setStock(request.stock());
        if (request.mainImageUrl() != null) existing.setMainImageUrl(request.mainImageUrl());

        return productMapper.toDetailResponse(productRepository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toDetailResponse)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductListResponse> getAllProducts(Pageable pageable) {
        Page<Product> page = productRepository.findAll(pageable);

        return new PageResponse<>(
                page.getContent().stream()
                        .map(productMapper::toListResponse)
                        .toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    // Add this to com.syriamart.commercial.service.impl.ProductServiceImpl


    @Override
    public ProductDetailResponse moderateProduct(String id, boolean approve) {
        // 1. Find the product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 2. Apply moderation logic
        if (approve) {
            product.setAdminApproved(true);
            product.setStatus(ProductStatus.ACTIVE); // Product is now live!
        } else {
            product.setAdminApproved(false);
            product.setStatus(ProductStatus.REJECTED); // Product is hidden
        }

        // 3. Save and return mapped DTO
        return productMapper.toDetailResponse(productRepository.save(product));
    }
}