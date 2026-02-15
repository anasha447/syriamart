package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.seller.SellerRegistrationRequest;
import com.syriamart.userservice.dto.request.user.UserLoginRequest;
import com.syriamart.userservice.dto.request.user.UserRegistrationRequest;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;

public interface AuthService {
    AuthenticationResponse login(UserLoginRequest request);
    String registerCustomer(UserRegistrationRequest request);
    String registerSeller(SellerRegistrationRequest request);
}
