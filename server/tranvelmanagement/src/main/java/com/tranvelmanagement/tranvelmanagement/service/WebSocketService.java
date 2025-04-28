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
    }
    
    public void sendNotification(String userId, Object notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }
}