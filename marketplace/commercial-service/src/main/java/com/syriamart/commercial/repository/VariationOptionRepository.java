package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.VariationOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationOptionRepository extends JpaRepository<VariationOption, String> {
    List<VariationOption> findByVariation_Id(String variationId);
}