package com.tranvelmanagement.tranvelmanagement.controller;

import com.tranvelmanagement.tranvelmanagement.dto.request.LoginRequest;
import com.tranvelmanagement.tranvelmanagement.dto.request.UserRegisterRequest;
import com.tranvelmanagement.tranvelmanagement.model.User;
import com.tranvelmanagement.tranvelmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        User user = new User();
        user.setUsername(userRegisterRequest.getUsername());
        user.setPassword(userRegisterRequest.getPassword());
        user.setEmail(userRegisterRequest.getEmail());
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
        User authenticatedUser = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users != null && !users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/users/{id}")
//    public Optional<User> getUserById(@PathVariable String id){
//        return  userService.getUserById(id);
//    }
@GetMapping("/users/{id}")
public ResponseEntity<User> getUserById(@PathVariable String id) {
    User user = userService.getUserById(id);
    if (user != null) {
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}


    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable String id, @RequestBody User updatedUser) {
        User existingUser = userService.getUserById(id);
        if (existingUser != null) {
            // Set the ID of the updated user to match the ID in the path variable
            updatedUser.setId(id);
            User updatedUserData = userService.updateUser(updatedUser);
            return ResponseEntity.ok(updatedUserData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}
