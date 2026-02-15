package com.syriamart.userservice.service.impl;

import com.syriamart.userservice.dto.request.address.AddressCreateRequest;
import com.syriamart.userservice.dto.request.address.AddressUpdateRequest;
import com.syriamart.userservice.dto.response.address.AddressResponse;
import com.syriamart.userservice.mapper.AddressMapper;
import com.syriamart.userservice.model.Address;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.repository.AddressRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.repository.UserRepository;
import com.syriamart.userservice.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional
    public AddressResponse createAddress(String userId, AddressCreateRequest request) {
        log.info("Creating address for user/seller: {}", userId);
        Address address = addressMapper.toEntity(request);

        // Determine if userId belongs to a User or Seller
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            address.setUser(userOpt.get());
        } else {
            Optional<Seller> sellerOpt = sellerRepository.findById(userId);
            if (sellerOpt.isPresent()) {
                address.setSeller(sellerOpt.get());
            } else {
                // Could also check Admin if admins have addresses, but requirements focused on User/Seller mainly.
                // Assuming Admin is not the primary use case for this endpoint based on "User Microservice" context usually implying customers/sellers.
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User/Seller not found");
            }
        }

        Address savedAddress = addressRepository.save(address);
        return addressMapper.toResponse(savedAddress);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(String addressId, String userId, AddressUpdateRequest request) {
        log.info("Updating address {} for user {}", addressId, userId);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

        // verify ownership
        boolean isOwner = (address.getUser() != null && address.getUser().getId().equals(userId)) ||
                          (address.getSeller() != null && address.getSeller().getId().equals(userId));

        if (!isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this address");
        }

        addressMapper.updateEntity(address, request);
        Address savedAddress = addressRepository.save(address);
        return addressMapper.toResponse(savedAddress);
    }

    @Override
    public List<AddressResponse> getUserAddresses(String userId) {
        // Try finding by User first
        List<Address> addresses = addressRepository.findByUserId(userId);
        if (addresses.isEmpty()) {
            // Then try Seller
            addresses = addressRepository.findBySellerId(userId);
        }

        return addresses.stream()
                .map(addressMapper::toResponse)
                .collect(Collectors.toList());
    }
}
