import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="relative">
                <img
                  className="w-8 h-8 mt-1 rounded-full"
                  src={m.sender.pic}
                  alt={m.sender.name}
                  title={m.sender.name}
                />
              </div>
            )}
            <span
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
              }}
              className={`px-4 py-2 max-w-3/4 rounded-2xl ${
                m.sender._id === user._id
                  ? "bg-teal-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;