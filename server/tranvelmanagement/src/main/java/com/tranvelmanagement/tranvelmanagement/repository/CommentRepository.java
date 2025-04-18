package com.tranvelmanagement.tranvelmanagement.repository;

import com.tranvelmanagement.tranvelmanagement.model.Comment;
import com.tranvelmanagement.tranvelmanagement.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {



}
