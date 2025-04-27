package com.tranvelmanagement.tranvelmanagement.dto.request;

import lombok.Data;

@Data
public class SendMessageRequest {
    private String content;
    private String chatId;
}