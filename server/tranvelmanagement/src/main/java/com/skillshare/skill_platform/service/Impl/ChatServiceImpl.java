package com.skillshare.skill_platform.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillshare.skill_platform.entity.Chat;
import com.skillshare.skill_platform.repository.ChatRepository;
import com.skillshare.skill_platform.service.ChatService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public Chat save(Chat chat) {
        chat.setId(UUID.randomUUID().toString());
        return chatRepository.save(chat);
    }

    @Override
    public List<Chat> findChatMessages(String senderId, String recipientId) {
        List<Chat> messages = new ArrayList<>();
        messages.addAll(chatRepository.findBySenderIdAndRecipientId(senderId, recipientId));
        messages.addAll(chatRepository.findBySenderIdAndRecipientId(recipientId, senderId));
        return messages;
    }
}