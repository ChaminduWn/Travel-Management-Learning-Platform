package com.skillshare.skill_platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.skillshare.skill_platform.dto.UserProfileDTO;
import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.service.UserService;

import java.util.List;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    // Existing profile management endpoints
    @PostMapping("/api/users/{userId}/profile")
    public ResponseEntity<UserProfileDTO> createOrUpdateProfile(@PathVariable String userId, @RequestBody UserProfileDTO profileDTO) {
        UserProfileDTO result = userService.createOrUpdateProfile(userId, profileDTO);
        return ResponseEntity.status(201).body(result);
    }

    @GetMapping("/api/users/{userId}/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String userId) {
        UserProfileDTO profile = userService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/api/users/{userId}/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@PathVariable String userId, @RequestBody UserProfileDTO profileDTO) {
        UserProfileDTO result = userService.createOrUpdateProfile(userId, profileDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/api/users/{userId}/profile")
    public ResponseEntity<Void> deleteProfile(@PathVariable String userId) {
        return ResponseEntity.noContent().build();
    }

    // Chatroom endpoints
    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User addUser(@Payload User user) {
        userService.saveUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnectUser(@Payload User user) {
        userService.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userService.findConnectedUsers());
    }
}