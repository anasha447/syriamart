package com.syriamart.userservice.service;

import com.syriamart.userservice.dto.request.user.UserBanRequest;
import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;

public interface UserService {
    UserProfileResponse updateUserProfile(String userId, UserProfileUpdateRequest request);
    void banUser(String userId, UserBanRequest request);
}
