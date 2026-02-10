package com.syriamart.logistics.repository;

import com.syriamart.logistics.model.DeliveryProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryProfileRepository extends JpaRepository<DeliveryProfile, String> {
    List<DeliveryProfile> findByIsAvailable(Boolean isAvailable);
}