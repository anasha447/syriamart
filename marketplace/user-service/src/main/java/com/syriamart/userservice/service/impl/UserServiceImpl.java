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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserProfileResponse getUserProfile(String userId) {
        log.info("Fetching profile for user: {}", userId);
        return userRepository.findById(userId)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Override
    public List<UserProfileResponse> getAllCustomers() {
        log.info("Fetching all registered users");
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setIsActive(!request.banned()); // Active if NOT banned
        userRepository.save(user);
        log.info("User {} active status set to: {}", userId, user.getIsActive());
    }
}