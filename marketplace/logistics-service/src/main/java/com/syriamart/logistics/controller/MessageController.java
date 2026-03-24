package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.request.message.MessageSendRequest;
import com.syriamart.logistics.dto.response.message.MessageResponse;
import com.syriamart.logistics.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('DRIVER','ADMIN')")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> send(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody MessageSendRequest req) {
        // Infer role from principal authorities
        String role = user.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.replace("ROLE_",""))
                .findFirst().orElse("DRIVER");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.send(user.getUsername(), role, req));
    }

    @GetMapping("/conversation/{otherPartyId}")
    public ResponseEntity<List<MessageResponse>> conversation(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String otherPartyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(messageService.getConversation(
                user.getUsername(), otherPartyId, PageRequest.of(page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(Map.of("count", messageService.unreadCount(user.getUsername())));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal UserDetails user) {
        messageService.markAllRead(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
