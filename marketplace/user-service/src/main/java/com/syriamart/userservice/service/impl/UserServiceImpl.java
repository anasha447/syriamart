package com.syriamart.userservice.service.impl;

import com.syriamart.userservice.dto.request.user.UserBanRequest;
import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import com.syriamart.userservice.mapper.UserMapper;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.repository.UserRepository;
import com.syriamart.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(String userId, UserProfileUpdateRequest request) {
        log.info("Updating profile for user: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userMapper.updateUserFromRequest(user, request);
        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional
    public void banUser(String userId, UserBanRequest request) {
        log.info("Processing ban request for user: {}", userId);

        // Ensure the path variable userId matches the body userId if deemed necessary,
        // or just use the path variable.
        // Ideally controller checks matching or we trust the service call.

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.banned()) {
             user.setIsActive(false);
             log.warn("User {} has been BANNED. Reason: {}", userId, request.reason());
        } else {
             user.setIsActive(true);
             log.info("User {} has been UNBANNED. Reason: {}", userId, request.reason());
        }

        userRepository.save(user);
    }
}
