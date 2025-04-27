package com.tranvelmanagement.tranvelmanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MessageDTO {
    private String id;
    private UserDTO sender;
    private String content;
    private String chatId;
    private List<UserDTO> readBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}