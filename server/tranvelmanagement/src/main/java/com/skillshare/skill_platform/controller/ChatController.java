package com.skillshare.skill_platform.controller;

import com.skillshare.skill_platform.entity.ChatMessage;
import com.skillshare.skill_platform.entity.ChatRoom;
import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.service.ChatService;
import com.skillshare.skill_platform.service.CustomOAuth2UserService;
import com.skillshare.skill_platform.repository.ChatRoomRepository;
import com.skillshare.skill_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ChatController {
    
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    
    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate, 
                          UserRepository userRepository, ChatRoomRepository chatRoomRepository) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.chatRoomRepository = chatRoomRepository;
    }
    
    @PostMapping("/rooms")
    public ResponseEntity<?> createChatRoom(
            @RequestBody ChatRoomRequest request, 
            @AuthenticationPrincipal Object principal) {
        User user = extractUser(principal);
        if (user == null) {
            System.err.println("No authenticated user found for POST /api/chat/rooms. Principal: " + 
                (principal != null ? principal.getClass().getName() : "null"));
            return ResponseEntity.status(401).body("User not authenticated");
        }
        System.out.println("Creating chat room for user: " + user.getId() + ", email: " + user.getEmail());
        System.out.println("Request isActive: " + request.isActive());
        try {
            ChatRoom chatRoom = chatService.createChatRoom(
                request.getName(),
                request.getDescription(),
                request.getTime(),
                request.getDate(),
                request.isActive(),
                user
            );
            return ResponseEntity.ok(chatRoom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creating chat room: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to create chat room: " + e.getMessage());
        }
    }
    
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<?> updateChatRoom(
            @PathVariable String roomId,
            @RequestBody ChatRoomRequest request,
            @AuthenticationPrincipal Object principal) {
        User user = extractUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            ChatRoom updatedRoom = chatService.updateChatRoom(
                roomId,
                request.getName(),
                request.getDescription(),
                request.getTime(),
                request.getDate(),
                request.isActive(),
                user
            );
            return ResponseEntity.ok(updatedRoom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error updating chat room: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update chat room: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<?> deleteChatRoom(
            @PathVariable String roomId,
            @AuthenticationPrincipal Object principal) {
        User user = extractUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            chatService.deleteChatRoom(roomId, user);
            return ResponseEntity.ok("Chat room deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error deleting chat room: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete chat room: " + e.getMessage());
        }
    }
    
    @PostMapping("/rooms/{roomId}/join")
    public ResponseEntity<?> joinChatRoom(
            @PathVariable String roomId,
            @AuthenticationPrincipal Object principal) {
        User user = extractUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            ChatRoom chatRoom = chatService.addParticipant(roomId, user);
            return ResponseEntity.ok(chatRoom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error joining chat room: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to join chat room: " + e.getMessage());
        }
    }
    
    @GetMapping("/rooms")
    public ResponseEntity<?> getUserChatRooms(@AuthenticationPrincipal Object principal) {
        User user = extractUser(principal);
        if (user == null) {
            System.err.println("No authenticated user found for GET /api/chat/rooms. Principal: " + 
                (principal != null ? principal.getClass().getName() : "null"));
            return ResponseEntity.status(401).body("User not authenticated");
        }
        System.out.println("Fetching chat rooms for user: " + user.getId() + ", email: " + user.getEmail());
        try {
            List<ChatRoom> rooms = chatService.getUserChatRooms(user.getId());
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            System.err.println("Error fetching chat rooms: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch chat rooms: " + e.getMessage());
        }
    }
    
    @GetMapping("/messages/{roomId}")
    public ResponseEntity<?> getChatMessages(@PathVariable String roomId) {
        try {
            List<ChatMessage> messages = chatService.getChatMessages(roomId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("Error fetching messages for room " + roomId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch messages: " + e.getMessage());
        }
    }
    
    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, @AuthenticationPrincipal Object principal) {
        try {
            System.out.println("Raw message received: " + chatMessage);
            User sender = chatMessage.getSender() != null && chatMessage.getSender().getId() != null
                ? userRepository.findById(chatMessage.getSender().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Sender not found: " + chatMessage.getSender().getId()))
                : null;
            ChatRoom chatRoom = chatMessage.getChatRoom() != null && chatMessage.getChatRoom().getId() != null
                ? chatRoomRepository.findById(chatMessage.getChatRoom().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Chat room not found: " + chatMessage.getChatRoom().getId()))
                : null;

            System.out.println("Resolved sender: " + (sender != null ? sender.getId() : "null") + 
                ", resolved chatRoom: " + (chatRoom != null ? chatRoom.getId() : "null"));
            System.out.println("Received message to send: " + chatMessage.getContent() + 
                " for room: " + (chatRoom != null ? chatRoom.getId() : "null") + 
                ", sender: " + (sender != null ? sender.getId() : "null"));

            if (chatRoom == null || chatRoom.getId() == null) {
                throw new IllegalArgumentException("Chat room ID is null");
            }
            if (sender == null || sender.getId() == null) {
                throw new IllegalArgumentException("Sender is null");
            }

            ChatMessage savedMessage = chatService.sendMessage(
                chatRoom.getId(),
                chatMessage.getContent(),
                sender
            );
            messagingTemplate.convertAndSend(
                "/topic/room." + chatRoom.getId(), 
                savedMessage
            );
            System.out.println("Message saved and sent to topic: /topic/room." + chatRoom.getId());
            return savedMessage;
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private User extractUser(Object principal) {
        if (principal instanceof CustomOAuth2UserService.CustomOAuth2User) {
            User user = ((CustomOAuth2UserService.CustomOAuth2User) principal).getUser();
            System.out.println("Extracted user: ID=" + user.getId() + ", Email=" + user.getEmail() + 
                ", OAuthProvider=" + user.getOauthProvider());
            return user;
        }
        System.err.println("Principal is not CustomOAuth2User: " + 
            (principal != null ? principal.getClass().getName() : "null"));
        return null;
    }
    
    public static class ChatRoomRequest {
        private String name;
        private String description;
        private LocalTime time;
        private LocalDate date;
        private boolean isActive = true;
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public LocalTime getTime() {
            return time;
        }
        
        public void setTime(LocalTime time) {
            this.time = time;
        }
        
        public LocalDate getDate() {
            return date;
        }
        
        public void setDate(LocalDate date) {
            this.date = date;
        }
        
        public boolean isActive() {
            return isActive;
        }
        
        public void setActive(boolean isActive) {
            this.isActive = isActive;
        }
    }
}