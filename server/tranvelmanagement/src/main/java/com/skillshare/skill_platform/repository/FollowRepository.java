package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {
    Optional<Follow> findByFollowerIdAndFollowedId(String followerId, String followedId);
    List<Follow> findByFollowerId(String followerId);
    List<Follow> findByFollowedId(String followedId);
}