package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.product.*;
import com.syriamart.commercial.dto.response.product.*;
import com.syriamart.commercial.mapper.ProductMapper;
import com.syriamart.commercial.model.*;
import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.ProductService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository              productRepo;
    private final CategoryRepository             categoryRepo;
    private final SubCategoryRepository          subCategoryRepo;
    private final ProductImageRepository         imageRepo;
    private final ProductVariationRepository     variationRepo;
    private final VariationOptionRepository      optionRepo;
    private final ProductVariationValueRepository pvvRepo;
    private final ProductMapper                  productMapper;

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public ProductDetailResponse createProduct(String sellerId, ProductCreateRequest req) {
        Category category = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", req.categoryId()));

        SubCategory subCategory = null;
        if (req.subCategoryId() != null) {
            subCategory = subCategoryRepo.findById(req.subCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubCategory", req.subCategoryId()));
        }

        Product product = Product.builder()
                .sellerId(sellerId)
                .category(category)
                .subCategory(subCategory)
                .name(req.name())
                .slug(uniqueSlug(req.name()))
                .description(req.description())
                .basePrice(req.basePrice())
                .stockQuantity(req.stockQuantity())
                .tags(req.tags())
                .status(ProductStatus.PENDING_REVIEW)
                .build();

        // Attach variation axes + options if provided
        if (req.variations() != null && !req.variations().isEmpty()) {
            buildVariations(product, req.variations());
        }

        return productMapper.toDetail(productRepo.save(product));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public ProductDetailResponse updateProduct(String productId, String sellerId, ProductUpdateRequest req) {
        Product product = getOwnedProduct(productId, sellerId);

        if (req.name()          != null) { product.setName(req.name()); product.setSlug(uniqueSlug(req.name())); }
        if (req.description()   != null)  product.setDescription(req.description());
        if (req.basePrice()     != null)  product.setBasePrice(req.basePrice());
        if (req.stockQuantity() != null)  product.setStockQuantity(req.stockQuantity());
        if (req.tags()          != null)  product.setTags(req.tags());
        if (req.categoryId()    != null) {
            Category cat = categoryRepo.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", req.categoryId()));
            product.setCategory(cat);
        }
        if (req.subCategoryId() != null) {
            SubCategory sub = subCategoryRepo.findById(req.subCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubCategory", req.subCategoryId()));
            product.setSubCategory(sub);
        }

        // Editing a live product puts it back into review
        if (product.getStatus() == ProductStatus.ACTIVE) {
            product.setStatus(ProductStatus.PENDING_REVIEW);
        }

        return productMapper.toDetail(productRepo.save(product));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void deleteProduct(String productId, String sellerId) {
        Product product = getOwnedProduct(productId, sellerId);
        product.setStatus(ProductStatus.ARCHIVED);
        productRepo.save(product);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // IMAGES
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public ProductDetailResponse addImages(String productId, String sellerId,
                                           List<ProductImageRequest> requests) {
        Product product = getOwnedProduct(productId, sellerId);

        // Enforce: at most one primary image across the entire product
        boolean alreadyHasPrimary = product.getImages().stream().anyMatch(ProductImage::isPrimary);

        for (ProductImageRequest req : requests) {
            boolean makePrimary = req.isPrimary() && !alreadyHasPrimary;
            ProductImage img = ProductImage.builder()
                    .product(product)
                    .url(req.url())
                    .isPrimary(makePrimary)
                    .displayOrder(req.displayOrder())
                    .altText(req.altText())
                    .build();
            product.getImages().add(img);
            if (makePrimary) alreadyHasPrimary = true;
        }

        return productMapper.toDetail(productRepo.save(product));
    }

    @Override
    public void removeImage(String productId, String imageId, String sellerId) {
        getOwnedProduct(productId, sellerId); // authorization check
        ProductImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", imageId));
        if (!img.getProduct().getId().equals(productId)) {
            throw new IllegalStateException("Image does not belong to this product.");
        }
        imageRepo.delete(img);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VARIATIONS (replace all — simplest correct approach for MVP)
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public ProductDetailResponse setVariations(String productId, String sellerId,
                                               List<ProductVariationRequest> requests) {
        Product product = getOwnedProduct(productId, sellerId);

        // Wipe existing variations and variation values; JPA orphanRemoval handles DB deletes
        product.getVariations().clear();
        product.getVariationValues().clear();

        buildVariations(product, requests);

        return productMapper.toDetail(productRepo.save(product));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse findById(String productId) {
        return productMapper.toDetail(getProduct(productId));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse findBySlug(String slug) {
        Product product = productRepo.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", slug));
        return productMapper.toDetail(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse findBySeller(String sellerId, Pageable pageable) {
        Page<Product> page = productRepo.findBySellerIdAndStatus(
                sellerId, ProductStatus.ACTIVE, pageable);
        return toListResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductCatalogResponse findByCategory(String categoryId, Pageable pageable) {
        Page<Product> page = productRepo.findByStatusAndCategoryId(
                ProductStatus.ACTIVE, categoryId, pageable);
        Category cat = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));
        return new ProductCatalogResponse(
                categoryId, cat.getName(), null,
                page.getContent().stream().map(p -> toSummary(p)).toList(),
                page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductCatalogResponse findBySubCategory(String subCategoryId, Pageable pageable) {
        Page<Product> page = productRepo.findByStatusAndSubCategoryId(
                ProductStatus.ACTIVE, subCategoryId, pageable);
        SubCategory sub = subCategoryRepo.findById(subCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException("SubCategory", subCategoryId));
        return new ProductCatalogResponse(
                sub.getCategory().getId(), sub.getCategory().getName(), subCategoryId,
                page.getContent().stream().map(this::toSummary).toList(),
                page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponse search(String query, Pageable pageable) {
        Page<Product> page = productRepo.searchActive(query, pageable);
        return new ProductSearchResponse(
                query,
                page.getContent().stream().map(this::toSummary).toList(),
                page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse findTopSelling(int limit) {
        List<Product> products = productRepo.findTopSelling(PageRequest.of(0, limit));
        return new ProductListResponse(products.stream().map(this::toSummary).toList(),
                0, limit, products.size(), 1);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse findTopRated(int limit) {
        List<Product> products = productRepo.findTopRated(PageRequest.of(0, limit));
        return new ProductListResponse(products.stream().map(this::toSummary).toList(),
                0, limit, products.size(), 1);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN MODERATION
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public ProductDetailResponse moderate(String productId, ProductModerationRequest req) {
        Product product = getProduct(productId);
        product.setStatus(req.status());
        if (req.status() == ProductStatus.REJECTED) {
            if (req.rejectionReason() == null || req.rejectionReason().isBlank()) {
                throw new IllegalArgumentException("Rejection reason is required when rejecting a product.");
            }
            product.setRejectionReason(req.rejectionReason());
        } else {
            product.setRejectionReason(null);
        }
        return productMapper.toDetail(productRepo.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductModerationQueueResponse getPendingQueue() {
        Page<Product> page = productRepo.findByStatus(
                ProductStatus.PENDING_REVIEW, PageRequest.of(0, 50));
        long total = productRepo.countByStatus(ProductStatus.PENDING_REVIEW);
        return new ProductModerationQueueResponse(
                page.getContent().stream().map(this::toSummary).toList(), total);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private Product getProduct(String id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private Product getOwnedProduct(String productId, String sellerId) {
        Product product = getProduct(productId);
        if (!product.getSellerId().equals(sellerId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not own this product.");
        }
        return product;
    }

    private ProductSummaryResponse toSummary(Product p) {
        // Apply the best active discount — simplified: take basePrice as effective for now.
        // Full discount resolution is done in the pricing engine (DiscountRepository).
        BigDecimal effective = p.getBasePrice();
        return productMapper.toSummary(p, effective);
    }

    private ProductListResponse toListResponse(Page<Product> page) {
        return new ProductListResponse(
                page.getContent().stream().map(this::toSummary).toList(),
                page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    /** Build variation axes + options and attach them to the product. */
    private void buildVariations(Product product, List<ProductVariationRequest> requests) {
        for (ProductVariationRequest vReq : requests) {
            ProductVariation variation = ProductVariation.builder()
                    .product(product)
                    .name(vReq.name())
                    .displayOrder(vReq.displayOrder())
                    .build();
            List<VariationOption> options = new ArrayList<>();
            for (VariationOptionRequest oReq : vReq.options()) {
                VariationOption opt = VariationOption.builder()
                        .variation(variation)
                        .value(oReq.value())
                        .colorHex(oReq.colorHex())
                        .displayOrder(oReq.displayOrder())
                        .build();
                options.add(opt);
            }
            variation.setOptions(options);
            product.getVariations().add(variation);
        }
    }

    private static final Pattern NON_LATIN  = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    private String uniqueSlug(String name) {
        String base = NON_LATIN.matcher(
                WHITESPACE.matcher(
                        Normalizer.normalize(name, Normalizer.Form.NFD)
                                  .toLowerCase(Locale.ENGLISH))
                          .replaceAll("-"))
                .replaceAll("")
                .replaceAll("-+", "-");

        String slug = base;
        int suffix  = 1;
        while (productRepo.findBySlug(slug).isPresent()) {
            slug = base + "-" + suffix++;
        }
        return slug;
    }
}
