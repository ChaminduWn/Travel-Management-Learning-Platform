package com.tranvelmanagement.tranvelmanagement.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CreateGroupChatRequest {
    private String name;
    private List<String> users;
}