package com.tranvelmanagement.tranvelmanagement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String pic;       // This field should exist in User if needed


}