package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.Follow;
import java.util.List;

public interface FollowService {
    void followUser(String followerId, String followedId);
    void unfollowUser(String followerId, String followedId);
    List<Follow> getFollowers(String userId);
    List<Follow> getFollowing(String userId);
}