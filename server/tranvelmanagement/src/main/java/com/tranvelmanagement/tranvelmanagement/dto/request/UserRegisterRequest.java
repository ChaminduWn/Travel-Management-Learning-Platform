package com.tranvelmanagement.tranvelmanagement.dto.request;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String username;
    private String password;
    private String email;
}
