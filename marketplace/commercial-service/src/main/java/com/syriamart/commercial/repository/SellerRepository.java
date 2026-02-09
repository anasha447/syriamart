package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Seller;
import com.syriamart.commercial.model.enums.SellerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, String> {
    Optional<Seller> findByEmail(String email);

    List<Seller> findByStatus(SellerStatus status);

    List<Seller> findByAdminApproved(Boolean adminApproved);
}