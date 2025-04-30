package com.skillshare.skill_platform.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillshare.skill_platform.entity.User;
import com.skillshare.skill_platform.entity.Status;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOauthProviderAndOauthId(String oauthProvider, String oauthId);
    List<User> findAllByStatus(Status status); // Add this for chatroom
}