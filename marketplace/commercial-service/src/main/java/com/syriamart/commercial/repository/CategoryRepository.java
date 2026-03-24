package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
    List<Category> findAllByActiveTrueOrderByDisplayOrderAsc();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.subCategories WHERE c.active = true ORDER BY c.displayOrder")
    List<Category> findAllActiveWithSubCategories();
}
