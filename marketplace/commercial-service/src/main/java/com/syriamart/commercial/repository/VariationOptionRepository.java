package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.VariationOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariationOptionRepository extends JpaRepository<VariationOption, String> {
    List<VariationOption> findByVariationIdOrderByDisplayOrderAsc(String variationId);
}
