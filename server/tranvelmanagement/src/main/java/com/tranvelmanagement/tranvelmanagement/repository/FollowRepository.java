package com.tranvelmanagement.tranvelmanagement.repository;

import com.tranvelmanagement.tranvelmanagement.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    Follow findByFollowerIdAndFolloweeId(String followerId, String followeeId);
}
