import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../pages/Profile";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../context/ChatProvider";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      // Toast notification would need to be implemented with a Tailwind-compatible solution
      console.error("Failed to Load the Messages", error);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        // Toast notification would need to be implemented with a Tailwind-compatible solution
        console.error("Failed to send the Message", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between w-full px-2 pb-3">
            <button 
              className="flex items-center justify-center p-2 rounded-full md:hidden hover:bg-gray-200"
              onClick={() => setSelectedChat("")}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <p className="text-2xl md:text-3xl font-['Work_sans']">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
            </p>
            {!selectedChat.isGroupChat ? (
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            ) : (
              <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            )}
          </div>

          <div className="flex flex-col justify-end w-full h-full p-3 overflow-y-hidden bg-gray-200 rounded-lg">
            {loading ? (
              <div className="self-center m-auto">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col h-full mb-3 overflow-y-auto">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className="mt-3" onKeyDown={sendMessage}>
              {istyping ? (
                <div className="mb-4 ml-0">
                  <Lottie options={defaultOptions} width={70} />
                </div>
              ) : null}
              <input
                className="w-full px-3 py-2 bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl font-['Work_sans']">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;