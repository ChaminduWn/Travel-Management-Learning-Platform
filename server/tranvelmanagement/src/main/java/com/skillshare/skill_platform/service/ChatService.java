package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.Chat;

import java.util.List;

public interface ChatService {
    Chat save(Chat chat);
    List<Chat> findChatMessages(String senderId, String recipientId);
}