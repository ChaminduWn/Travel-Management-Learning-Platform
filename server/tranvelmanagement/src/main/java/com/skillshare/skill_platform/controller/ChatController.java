package com.skillshare.skill_platform.controller;

import com.tranvelmanagement.tranvelmanagement.dto.ApiResponse;
import com.tranvelmanagement.tranvelmanagement.dto.ChatDTO;
import com.tranvelmanagement.tranvelmanagement.dto.request.AccessChatRequest;
import com.tranvelmanagement.tranvelmanagement.dto.request.CreateGroupChatRequest;
import com.tranvelmanagement.tranvelmanagement.dto.request.GroupUpdateRequest;
import com.tranvelmanagement.tranvelmanagement.dto.request.RenameGroupRequest;
import com.tranvelmanagement.tranvelmanagement.model.Chat;
import com.tranvelmanagement.tranvelmanagement.model.User;
import com.tranvelmanagement.tranvelmanagement.service.ChatService;
import com.tranvelmanagement.tranvelmanagement.util.DTOConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private DTOConverter dtoConverter;
    
    @PostMapping
    public ResponseEntity<?> accessChat(@RequestBody AccessChatRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Chat chat = chatService.accessChat(request.getUserId(), currentUser);
            return ResponseEntity.ok(dtoConverter.convertToDTO(chat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> fetchChats(@AuthenticationPrincipal User currentUser) {
        try {
            List<Chat> chats = chatService.fetchChats(currentUser);
            List<ChatDTO> chatDTOs = chats.stream()
                    .map(chat -> dtoConverter.convertToDTO(chat))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(chatDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/group")
    public ResponseEntity<?> createGroupChat(@RequestBody CreateGroupChatRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Chat groupChat = chatService.createGroupChat(request.getName(), request.getUsers(), currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(dtoConverter.convertToDTO(groupChat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/rename")
    public ResponseEntity<?> renameGroup(@RequestBody RenameGroupRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Chat updatedChat = chatService.renameGroup(request.getChatId(), request.getChatName(), currentUser);
            return ResponseEntity.ok(dtoConverter.convertToDTO(updatedChat));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/groupremove")
    public ResponseEntity<?> removeFromGroup(@RequestBody GroupUpdateRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Chat updatedChat = chatService.removeFromGroup(request.getChatId(), request.getUserId(), currentUser);
            return ResponseEntity.ok(dtoConverter.convertToDTO(updatedChat));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/groupadd")
    public ResponseEntity<?> addToGroup(@RequestBody GroupUpdateRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Chat updatedChat = chatService.addToGroup(request.getChatId(), request.getUserId(), currentUser);
            return ResponseEntity.ok(dtoConverter.convertToDTO(updatedChat));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        }
    }
}