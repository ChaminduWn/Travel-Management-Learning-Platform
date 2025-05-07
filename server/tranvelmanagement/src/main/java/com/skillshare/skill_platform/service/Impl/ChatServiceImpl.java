package com.skillshare.skill_platform.service.Impl;

import com.skillshare.skill_platform.entity.ChatMessage;
import com.skillshare.skill_platform.entity.ChatRoom;
import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.repository.ChatMessageRepository;
import com.skillshare.skill_platform.repository.ChatRoomRepository;
import com.skillshare.skill_platform.repository.UserRepository;
import com.skillshare.skill_platform.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public ChatServiceImpl(ChatRoomRepository chatRoomRepository, 
                          ChatMessageRepository chatMessageRepository,
                          UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    public ChatRoom createChatRoom(String name, User creator) {
        if (creator == null || creator.getId() == null) {
            throw new IllegalArgumentException("Creator user must not be null");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Chat room name must not be empty");
        }
        
        if (!userRepository.existsById(creator.getId())) {
            throw new IllegalArgumentException("User with ID " + creator.getId() + " not found in database");
        }
        if (creator.getUserProfile() == null || creator.getUserProfile().getId() == null) {
            throw new IllegalArgumentException("User with ID " + creator.getId() + " has no valid UserProfile");
        }
        
        try {
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setName(name);
            chatRoom.setCreatedBy(creator.getId());
            chatRoom.getParticipants().add(creator);
            ChatRoom savedRoom = chatRoomRepository.save(chatRoom);
            System.out.println("Created chat room: " + savedRoom.getId());
            return savedRoom;
        } catch (Exception e) {
            System.err.println("Error creating chat room: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create chat room: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ChatRoom addParticipant(String chatRoomId, User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User must not be null");
        }
        if (chatRoomId == null) {
            throw new IllegalArgumentException("Chat room ID must not be null");
        }
        if (!userRepository.existsById(user.getId())) {
            throw new IllegalArgumentException("User with ID " + user.getId() + " not found in database");
        }
        if (user.getUserProfile() == null || user.getUserProfile().getId() == null) {
            throw new IllegalArgumentException("User with ID " + user.getId() + " has no valid UserProfile");
        }
        
        try {
            return chatRoomRepository.findById(chatRoomId)
                .map(room -> {
                    if (room.getParticipants().stream().noneMatch(p -> p.getId().equals(user.getId()))) {
                        room.getParticipants().add(user);
                        return chatRoomRepository.save(room);
                    }
                    return room;
                })
                .orElseThrow(() -> new RuntimeException("Chat room not found: " + chatRoomId));
        } catch (Exception e) {
            System.err.println("Error adding participant to chat room: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to add participant: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<ChatRoom> getUserChatRooms(String userId) {
        if (userId == null) {
            System.err.println("User ID is null when fetching chat rooms");
            return Collections.emptyList();
        }
        if (!userRepository.existsById(userId)) {
            System.err.println("User with ID " + userId + " not found in database");
            return Collections.emptyList();
        }
        
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));
            
            List<ChatRoom> allRooms = chatRoomRepository.findAll();
            
            List<ChatRoom> updatedRooms = allRooms.stream()
                .map(room -> {
                    if (room.getParticipants().stream().noneMatch(p -> p.getId().equals(userId))) {
                        room.getParticipants().add(user);
                        return chatRoomRepository.save(room);
                    }
                    return room;
                })
                .collect(Collectors.toList());
            
            System.out.println("Fetched and updated " + updatedRooms.size() + " chat rooms for user: " + userId);
            return updatedRooms;
        } catch (Exception e) {
            System.err.println("Error fetching chat rooms for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch chat rooms: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ChatMessage sendMessage(String chatRoomId, String content, User sender) {
        if (sender == null || sender.getId() == null) {
            throw new IllegalArgumentException("Sender must not be null");
        }
        if (chatRoomId == null || content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Chat room ID and content must not be null or empty");
        }
        if (!userRepository.existsById(sender.getId())) {
            throw new IllegalArgumentException("User with ID " + sender.getId() + " not found in database");
        }
        if (sender.getUserProfile() == null || sender.getUserProfile().getId() == null) {
            throw new IllegalArgumentException("User with ID " + sender.getId() + " has no valid UserProfile");
        }
        
        try {
            System.out.println("Saving message: " + content + " for room: " + chatRoomId + " by sender: " + sender.getId());
            ChatMessage message = new ChatMessage();
            message.setContent(content);
            message.setSender(sender);
            message.setTimestamp(LocalDateTime.now());
            
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room with ID " + chatRoomId + " not found"));
            message.setChatRoom(chatRoom);
            
            ChatMessage savedMessage = chatMessageRepository.save(message);
            System.out.println("Message saved with ID: " + savedMessage.getId());
            return savedMessage;
        } catch (Exception e) {
            System.err.println("Error sending message in chat room " + chatRoomId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send message: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<ChatMessage> getChatMessages(String chatRoomId) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("Chat room ID must not be null");
        }
        
        try {
            return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
        } catch (Exception e) {
            System.err.println("Error fetching messages for chat room " + chatRoomId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch messages: " + e.getMessage(), e);
        }
    }
}