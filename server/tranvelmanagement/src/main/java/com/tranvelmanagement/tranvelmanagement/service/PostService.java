package com.tranvelmanagement.tranvelmanagement.service;

import com.tranvelmanagement.tranvelmanagement.dto.request.PostRequest;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface PostService {
    public ResponseEntity<Map> createPost(PostRequest postRequest);
    public ResponseEntity<Map> getPost(String postId);
    ResponseEntity<Map> getAllPosts();
    public ResponseEntity<Map> updatePost(String postId, PostRequest postRequest);
    public ResponseEntity<Map> deletePost(String postId);
}
