package com.tranvelmanagement.tranvelmanagement.dto.request;

import lombok.Data;

@Data
public class RenameGroupRequest {
    private String chatId;
    private String chatName;
}