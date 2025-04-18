package com.tranvelmanagement.tranvelmanagement.service;

import com.tranvelmanagement.tranvelmanagement.dto.request.CommentRequest;
import com.tranvelmanagement.tranvelmanagement.model.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(String postId, CommentRequest commentRequest);

    List<Comment> getAllCommentsByPostId(String postId);

    boolean deleteComment(String commentId, String userId);

    boolean updateComment(String commentId, String userId, CommentRequest commentRequest);
}
