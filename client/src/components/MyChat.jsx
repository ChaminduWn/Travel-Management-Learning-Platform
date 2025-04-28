import { useEffect, useState } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "../components/miscellaneous/GroupCHatModal";
import { ChatState } from "../context/ChatProvider";
import { PlusIcon } from '@heroicons/react/24/outline';


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to Load the chats", error);
      // Toast functionality would need to be implemented separately or using a Tailwind-compatible library
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div className="flex flex-col w-full p-3 bg-white border border-gray-200 rounded-lg md:w-1/3">
      <div className="flex items-center justify-between px-3 pb-3 text-lg font-semibold">
        My Chats
        <GroupChatModal>
          <button className="flex items-center gap-1 p-2 text-sm text-black bg-gray-100 rounded-lg hover:bg-gray-200">
            <PlusIcon className="w-4 h-4" />
            New Group Chat
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col w-full h-full p-3 overflow-hidden bg-gray-100 rounded-lg">
        {chats ? (
          <div className="overflow-y-scroll">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg mb-2 ${
                  selectedChat === chat ? "bg-teal-500 text-white" : "bg-gray-200 text-black"
                }`}
                key={chat._id}
              >
                <div className="font-bold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="text-sm">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;