package com.tranvelmanagement.tranvelmanagement.service;

import com.tranvelmanagement.tranvelmanagement.model.Chat;
import com.tranvelmanagement.tranvelmanagement.model.Message;
import com.tranvelmanagement.tranvelmanagement.model.User;
import com.tranvelmanagement.tranvelmanagement.repository.ChatRepository;
import com.tranvelmanagement.tranvelmanagement.repository.UserRepository;
import com.tranvelmanagement.tranvelmanagement.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {
    
    @Autowired
    private ChatMessageRepository chatRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Chat accessChat(String userId, User currentUser) {
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Optional<Chat> existingChat = chatRepository.findOneToOneChat(currentUser.getId(), userId);
        
        if (existingChat.isPresent()) {
            return existingChat.get();
        }
        
        Chat newChat = new Chat();
        newChat.setChatName("sender");
        newChat.setGroupChat(false);
        
        List<User> users = new ArrayList<>();
        users.add(currentUser);
        users.add(targetUser);
        newChat.setUsers(users);
        
        newChat.setCreatedAt(LocalDateTime.now());
        newChat.setUpdatedAt(LocalDateTime.now());
        
        return chatRepository.save(newChat);
    }
    
    public List<Chat> fetchChats(User user) {
        return chatRepository.findByUsersContainingOrderByUpdatedAtDesc(user);
    }
    
    public Chat createGroupChat(String name, List<String> userIds, User currentUser) {
        if (name == null || userIds.size() < 2) {
            throw new IllegalArgumentException("Please provide all required fields and include at least 2 users");
        }
        
        List<User> users = new ArrayList<>();
        for (String id : userIds) {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                users.add(userOpt.get());
            }
        }
        
        if (users.size() != userIds.size()) {
            throw new ResourceNotFoundException("One or more users not found");
        }
        
        users.add(currentUser);
        
        Chat groupChat = new Chat();
        groupChat.setChatName(name);
        groupChat.setUsers(users);
        groupChat.setGroupChat(true);
        groupChat.setGroupAdmin(currentUser);
        groupChat.setCreatedAt(LocalDateTime.now());
        groupChat.setUpdatedAt(LocalDateTime.now());
        
        return chatRepository.save(groupChat);
    }
    
    public Chat renameGroup(String chatId, String chatName, User currentUser) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));
        
        chat.setChatName(chatName);
        chat.setUpdatedAt(LocalDateTime.now());
        
        return chatRepository.save(chat);
    }
    
    public Chat removeFromGroup(String chatId, String userId, User currentUser) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));
        
        User userToRemove = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        chat.getUsers().remove(userToRemove);
        chat.setUpdatedAt(LocalDateTime.now());
        
        return chatRepository.save(chat);
    }
    
    public Chat addToGroup(String chatId, String userId, User currentUser) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));
        
        User userToAdd = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (!chat.getUsers().contains(userToAdd)) {
            chat.getUsers().add(userToAdd);
            chat.setUpdatedAt(LocalDateTime.now());
        }
        
        return chatRepository.save(chat);
    }
    
    public void updateLatestMessage(Chat chat, Message message) {
        chat.setLatestMessage(message);
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);
    }
}