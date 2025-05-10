package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.ChatMessage;
import com.skillshare.skill_platform.entity.ChatRoom;
import com.skillshare.skill_platform.entity.User;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ChatService {
    ChatRoom createChatRoom(String name, String description, LocalTime time, LocalDate date, boolean isActive, User creator);
    ChatRoom updateChatRoom(String chatRoomId, String name, String description, LocalTime time, LocalDate date, boolean isActive, User user);
    void deleteChatRoom(String chatRoomId, User user);
    ChatRoom addParticipant(String chatRoomId, User user);
    List<ChatRoom> getUserChatRooms(String userId);
    ChatMessage sendMessage(String chatRoomId, String content, User sender);
    List<ChatMessage> getChatMessages(String chatRoomId);
}