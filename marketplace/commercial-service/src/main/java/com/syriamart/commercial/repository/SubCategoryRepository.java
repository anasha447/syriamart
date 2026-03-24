package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubCategoryRepository extends JpaRepository<SubCategory, String> {
    Optional<SubCategory> findBySlug(String slug);
    List<SubCategory> findByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(String categoryId);
    boolean existsByNameIgnoreCaseAndCategoryId(String name, String categoryId);
}
