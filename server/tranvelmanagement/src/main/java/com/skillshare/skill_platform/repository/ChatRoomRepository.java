package com.skillshare.skill_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillshare.skill_platform.entity.ChatRoom;

import java.util.List;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByParticipantsId(String userId);
}