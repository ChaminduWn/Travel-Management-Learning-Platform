import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast("User already added", "warning");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Failed to Load the Search Results", "error");
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showToast("Please fill all the fields", "warning");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      showToast("New Group Chat Created!", "success");
    } catch (error) {
      showToast("Failed to Create the Chat!", "error");
    }
  };

  const showToast = (title, status) => {
    // This is a simple toast implementation
    // In a real app, you might want to create a more robust solution
    const toastElement = document.createElement("div");
    toastElement.className = `fixed bottom-4 right-4 p-4 rounded-md text-white ${
      status === "success" ? "bg-green-500" : 
      status === "error" ? "bg-red-500" : 
      status === "warning" ? "bg-yellow-500" : "bg-blue-500"
    }`;
    toastElement.innerText = title;
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 5000);
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg">
            <div className="p-6">
              <h2 className="text-3xl font-semibold font-['Work_sans'] mb-4 text-center">
                Create Group Chat
              </h2>
              <button
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col items-center">
                <div className="w-full mb-4">
                  <input
                    type="text"
                    placeholder="Chat Name"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </div>
                <div className="w-full mb-4">
                  <input
                    type="text"
                    placeholder="Add Users eg: John, Piyush, Jane"
                    className="w-full p-2 mb-1 border border-gray-300 rounded"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap w-full">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </div>
                {loading ? (
                  <div className="flex justify-center my-4">
                    <div className="w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                >
                  Create Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;