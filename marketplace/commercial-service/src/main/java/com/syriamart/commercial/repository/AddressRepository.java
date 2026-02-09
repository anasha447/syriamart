package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserId(String userId);

    List<Address> findBySellerId(String sellerId);
}