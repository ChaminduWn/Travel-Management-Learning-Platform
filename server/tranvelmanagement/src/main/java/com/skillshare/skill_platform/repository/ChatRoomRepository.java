package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByParticipantsId(String userId);
}