package com.skillshare.skill_platform.service.Impl;

import com.skillshare.skill_platform.entity.Follow;
import com.skillshare.skill_platform.repository.FollowRepository;
import com.skillshare.skill_platform.repository.UserRepository;
import com.skillshare.skill_platform.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void followUser(String followerId, String followedId) {
        if (followerId.equals(followedId)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        if (!userRepository.existsById(followerId) || !userRepository.existsById(followedId)) {
            throw new RuntimeException("User not found");
        }
        Optional<Follow> existingFollow = followRepository.findByFollowerIdAndFollowedId(followerId, followedId);
        if (existingFollow.isPresent()) {
            throw new RuntimeException("Already following this user");
        }
        Follow follow = new Follow();
        follow.setId(UUID.randomUUID().toString());
        follow.setFollowerId(followerId);
        follow.setFollowedId(followedId);
        follow.setCreatedAt(new Date());
        followRepository.save(follow);
    }

    @Override
    public void unfollowUser(String followerId, String followedId) {
        Optional<Follow> follow = followRepository.findByFollowerIdAndFollowedId(followerId, followedId);
        if (follow.isPresent()) {
            followRepository.delete(follow.get());
        } else {
            throw new RuntimeException("Not following this user");
        }
    }

    @Override
    public List<Follow> getFollowers(String userId) {
        return followRepository.findByFollowedId(userId);
    }

    @Override
    public List<Follow> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId);
    }
}