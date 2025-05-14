package com.skillshare.skill_platform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProgressController {

    // Placeholder: Replace with actual service injection
    // @Autowired
    // private ProgressService progressService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Object>> getUserProgressUpdates(@PathVariable String userId) {
        try {
            // Placeholder: Return empty list until service is implemented
            return ResponseEntity.ok(Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}