package com.tranvelmanagement.tranvelmanagement.util;

import com.tranvelmanagement.tranvelmanagement.dto.ChatDTO;
import com.tranvelmanagement.tranvelmanagement.dto.MessageDTO;
import com.tranvelmanagement.tranvelmanagement.dto.UserDTO;
import com.tranvelmanagement.tranvelmanagement.model.Chat;
import com.tranvelmanagement.tranvelmanagement.model.Message;
import com.tranvelmanagement.tranvelmanagement.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DTOConverter {
    
    public ChatDTO convertToDTO(Chat chat) {
        if (chat == null) return null;
        
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getId());
        chatDTO.setChatName(chat.getChatName());
        chatDTO.setGroupChat(chat.isGroupChat());
        
        if (chat.getUsers() != null) {
            chatDTO.setUsers(chat.getUsers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
        }
        
        if (chat.getLatestMessage() != null) {
            chatDTO.setLatestMessage(convertToDTO(chat.getLatestMessage()));
        }
        
        if (chat.getGroupAdmin() != null) {
            chatDTO.setGroupAdmin(convertToDTO(chat.getGroupAdmin()));
        }
        
        chatDTO.setCreatedAt(chat.getCreatedAt());
        chatDTO.setUpdatedAt(chat.getUpdatedAt());
        
        return chatDTO;
    }
    
    public MessageDTO convertToDTO(Message message) {
        if (message == null) return null;
        
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setSender(convertToDTO(message.getSender()));
        messageDTO.setContent(message.getContent());
        
        if (message.getChat() != null) {
            messageDTO.setChatId(message.getChat().getId());
        }
        
        if (message.getReadBy() != null) {
            messageDTO.setReadBy(message.getReadBy().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
        }
        
        messageDTO.setCreatedAt(message.getCreatedAt());
        messageDTO.setUpdatedAt(message.getUpdatedAt());
        
        return messageDTO;
    }
    
    public UserDTO convertToDTO(User user) {
        if (user == null) return null;
        
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        // Set profile picture or other necessary fields
        userDTO.setPic(user.getPic());
        
        return userDTO;
    }
}