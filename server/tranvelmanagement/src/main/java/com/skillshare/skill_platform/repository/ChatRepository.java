package com.tranvelmanagement.tranvelmanagement.repository;

import com.tranvelmanagement.tranvelmanagement.model.Chat;
import com.tranvelmanagement.tranvelmanagement.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    
    @Query("{'isGroupChat': false, 'users': { $all: [?0, ?1] }}")
    Optional<Chat> findOneToOneChat(String userId1, String userId2);
    
    List<Chat> findByUsersContainingOrderByUpdatedAtDesc(User user);
}