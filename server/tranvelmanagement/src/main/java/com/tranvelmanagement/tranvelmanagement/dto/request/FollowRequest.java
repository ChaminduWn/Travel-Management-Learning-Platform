package com.tranvelmanagement.tranvelmanagement.dto.request;

import lombok.Data;

@Data
public class FollowRequest {
    private String followerId;
    private String followeeId;
}
