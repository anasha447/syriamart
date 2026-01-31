package com.syriamart.project.repository;

import com.syriamart.project.model.DeliveryProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryProfileRepository extends JpaRepository<DeliveryProfile, String> {
}