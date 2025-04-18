package com.tranvelmanagement.tranvelmanagement.repository;

import com.tranvelmanagement.tranvelmanagement.model.Post;
import org.apache.catalina.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends MongoRepository<Post,String> {


}
