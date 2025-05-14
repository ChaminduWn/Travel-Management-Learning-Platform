package com.skillshare.skill_platform.controller;

import com.skillshare.skill_platform.entity.Follow;
import com.skillshare.skill_platform.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<Map<String, Object>> followUser(@PathVariable String followerId, @PathVariable String followedId) {
        try {
            followService.followUser(followerId, followedId);
            return ResponseEntity.ok(Map.of("message", "Successfully followed user"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{followerId}/unfollow/{followedId}")
    public ResponseEntity<Map<String, Object>> unfollowUser(@PathVariable String followerId, @PathVariable String followedId) {
        try {
            followService.unfollowUser(followerId, followedId);
            return ResponseEntity.ok(Map.of("message", "Successfully unfollowed user"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<Follow>> getFollowers(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<Follow>> getFollowing(@PathVariable String userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }
}