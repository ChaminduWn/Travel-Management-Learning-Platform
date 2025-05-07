package com.skillshare.skill_platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.skillshare.skill_platform.dto.RegisterRequest;
import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.repository.UserRepository;
import com.skillshare.skill_platform.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        System.out.println("Login request received for email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userService.authenticate(email, password);
            
            String token = UUID.randomUUID().toString();
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "oauthProvider", user.getOauthProvider()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest registerRequest) {
        String name = registerRequest.getName();
        String email = registerRequest.getEmail();
        String password = registerRequest.getPassword();
        
        System.out.println("Register request received for email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User newUser = userService.registerUser(name, email, password);
            
            String token = UUID.randomUUID().toString();
            
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("token", token);
            response.put("user", Map.of(
                "id", newUser.getId(),
                "name", newUser.getName(),
                "email", newUser.getEmail()
            ));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> checkAuthStatus() {
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            response.put("authenticated", true);
            response.put("user", Map.of(
                "id", oauth2User.getName(),
                "name", oauth2User.getAttribute("name") != null ? oauth2User.getAttribute("name") : "Unknown",
                "email", oauth2User.getAttribute("email") != null ? oauth2User.getAttribute("email") : "unknown@example.com",
                "oauthProvider", "google"
            ));
            return ResponseEntity.ok(response);
        }
        
        response.put("authenticated", false);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}