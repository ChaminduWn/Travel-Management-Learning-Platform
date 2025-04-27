package com.tranvelmanagement.tranvelmanagement.service;

import com.tranvelmanagement.tranvelmanagement.model.Chat;
import com.tranvelmanagement.tranvelmanagement.model.Message;
import com.tranvelmanagement.tranvelmanagement.model.User;
import com.tranvelmanagement.tranvelmanagement.repository.ChatRepository;
import com.tranvelmanagement.tranvelmanagement.repository.MessageRepository;
import com.tranvelmanagement.tranvelmanagement.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private WebSocketService websocketService;
        
    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private ChatService chatService;
    
    public List<Message> getAllMessages(String chatId) {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));
        
        return messageRepository.findByChatOrderByCreatedAt(chat);
    }
    
    public Message sendMessage(String content, String chatId, User sender) {
        if (content == null || chatId == null) {
            throw new IllegalArgumentException("Content and chat ID must be provided");
        }
        
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat not found with id: " + chatId));
        
        Message message = new Message();
        message.setSender(sender);
        message.setContent(content);
        message.setChat(chat);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        
        Message savedMessage = messageRepository.save(message);
        
        // Update the chat with latest message
        chatService.updateLatestMessage(chat, savedMessage);

        webSocketService.sendMessage(dtoConverter.convertToDTO(savedMessage));
        
        return savedMessage;
    }
}