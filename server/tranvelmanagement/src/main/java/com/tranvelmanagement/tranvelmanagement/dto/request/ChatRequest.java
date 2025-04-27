package com.tranvelmanagement.tranvelmanagement.dto.request;

package com.tranvelmanagement.tranvelmanagement.model.Message;
package com.tranvelmanagement.tranvelmanagement.model.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatRequest {
    private String id;
    private String chatName;
    private boolean isGroupChat;
    private List<UserDTO> users;
    private MessageDTO latestMessage;
    private UserDTO groupAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}