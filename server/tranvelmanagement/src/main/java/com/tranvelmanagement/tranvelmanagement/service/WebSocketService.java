package com.tranvelmanagement.tranvelmanagement.service;

import com.tranvelmanagement.tranvelmanagement.dto.MessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void sendMessage(MessageDTO message) {
        messagingTemplate.convertAndSend("/topic/chat/" + message.getChatId(), message);
        
        // Also send individual notifications to all users in the chat
        // This would require additional implementation to fetch users from the chat
    }
    
    public void sendNotification(String userId, Object notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
}