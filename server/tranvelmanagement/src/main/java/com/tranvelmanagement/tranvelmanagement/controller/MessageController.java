package com.tranvelmanagement.tranvelmanagement.controller;

import com.tranvelmanagement.tranvelmanagement.dto.ApiResponse;
import com.tranvelmanagement.tranvelmanagement.dto.MessageDTO;
import com.tranvelmanagement.tranvelmanagement.dto.request.SendMessageRequest;
import com.tranvelmanagement.tranvelmanagement.model.Message;
import com.tranvelmanagement.tranvelmanagement.model.User;
import com.tranvelmanagement.tranvelmanagement.service.MessageService;
import com.tranvelmanagement.tranvelmanagement.util.DTOConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private DTOConverter dtoConverter;
    
    @GetMapping("/{chatId}")
    public ResponseEntity<?> allMessages(@PathVariable String chatId) {
        try {
            List<Message> messages = messageService.getAllMessages(chatId);
            List<MessageDTO> messageDTOs = messages.stream()
                    .map(message -> dtoConverter.convertToDTO(message))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(messageDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            Message message = messageService.sendMessage(request.getContent(), request.getChatId(), currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(dtoConverter.convertToDTO(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}