package com.tranvelmanagement.tranvelmanagement.dto;

import com.tranvelmanagement.tranvelmanagement.model.Message;
import com.tranvelmanagement.tranvelmanagement.model.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatDTO {
    private String id;
    private String chatName;
    private boolean isGroupChat;
    private List<UserDTO> users;
    private MessageDTO latestMessage;
    private UserDTO groupAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}