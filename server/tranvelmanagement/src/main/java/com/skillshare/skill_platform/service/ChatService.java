package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.ChatMessage;
import com.skillshare.skill_platform.entity.ChatRoom;
import com.skillshare.skill_platform.entity.User;

import java.util.List;

public interface ChatService {
    ChatRoom createChatRoom(String name, User creator);
    ChatRoom addParticipant(String chatRoomId, User user);
    List<ChatRoom> getUserChatRooms(String userId);
    ChatMessage sendMessage(String chatRoomId, String content, User sender);
    List<ChatMessage> getChatMessages(String chatRoomId);
}