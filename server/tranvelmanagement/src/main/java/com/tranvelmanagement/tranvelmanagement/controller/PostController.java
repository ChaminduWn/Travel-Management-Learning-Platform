package com.tranvelmanagement.tranvelmanagement.controller;

import com.tranvelmanagement.tranvelmanagement.dto.request.PostRequest;
import com.tranvelmanagement.tranvelmanagement.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/posts")

public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/upload")
    public ResponseEntity<Map> upload(PostRequest postRequest) {
        try {
            return postService.createPost(postRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Map> getPost(@PathVariable String postId) {
        return postService.getPost(postId);
    }

    @GetMapping
    public ResponseEntity<Map> getAllPosts() {
        System.out.println("ok");
        return postService.getAllPosts();
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Map> updatePost(@PathVariable String postId, @RequestBody PostRequest postRequest) {
        return postService.updatePost(postId, postRequest);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Map> deletePost(@PathVariable String postId) {
        return postService.deletePost(postId);
    }
}



