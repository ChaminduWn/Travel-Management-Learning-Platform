package com.tranvelmanagement.tranvelmanagement.service;


import com.tranvelmanagement.tranvelmanagement.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    User loginUser(String username, String password);

    List<User> getAllUsers();

    User getUserById(String id);


    User updateUser(User updatedUser);
}