package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.user.UserBanRequest;
import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import java.util.List;

public interface UserService {
    // Existing methods
    UserProfileResponse updateUserProfile(String userId, UserProfileUpdateRequest request);
    void banUser(String userId, UserBanRequest request);

    // New methods to add
    UserProfileResponse getUserProfile(String userId);
    List<UserProfileResponse> getAllCustomers();
}