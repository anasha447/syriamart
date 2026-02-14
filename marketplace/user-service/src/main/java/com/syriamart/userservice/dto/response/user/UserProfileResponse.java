package com.syriamart.userservice.dto.response.user;

import com.syriamart.userservice.dto.response.address.AddressResponse;
import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResponse(String id, String email, String fullName, String phone,
        List<AddressResponse> addresses, LocalDateTime createdAt) {
}
