import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const showToast = (title, description = "", status) => {
    // Simple toast implementation
    const toastElement = document.createElement("div");
    toastElement.className = `fixed bottom-4 right-4 p-4 rounded-md text-white ${
      status === "success" ? "bg-green-500" : 
      status === "error" ? "bg-red-500" : 
      status === "warning" ? "bg-yellow-500" : "bg-blue-500"
    }`;
    
    const titleElement = document.createElement("div");
    titleElement.className = "font-bold";
    titleElement.innerText = title;
    
    toastElement.appendChild(titleElement);
    
    if (description) {
      const descElement = document.createElement("div");
      descElement.innerText = description;
      toastElement.appendChild(descElement);
    }
    
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 5000);
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
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Error Occurred!", "Failed to Load the Search Results", "error");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      showToast(
        "Error Occurred!",
        error.response?.data?.message || error.message,
        "error"
      );
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      showToast("User already in group!", "", "error");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can add someone!", "", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      showToast(
        "Error Occurred!",
        error.response?.data?.message || error.message,
        "error"
      );
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showToast("Only admins can remove someone!", "", "error");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      showToast(
        "Error Occurred!",
        error.response?.data?.message || error.message,
        "error"
      );
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <button 
        className="flex items-center justify-center p-2 rounded-full md:inline-flex hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg">
            <div className="p-6">
              <h2 className="text-3xl font-semibold font-['Work_Sans'] mb-4 text-center">
                {selectedChat.chatName}
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
                <div className="flex flex-wrap w-full pb-3">
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </div>
                <div className="flex w-full mb-3">
                  <input
                    type="text"
                    placeholder="Chat Name"
                    className="flex-grow p-2 border border-gray-300 rounded-l"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <button
                    className={`px-4 bg-teal-500 text-white rounded-r ${renameloading ? 'opacity-50' : 'hover:bg-teal-600'}`}
                    disabled={renameloading}
                    onClick={handleRename}
                  >
                    {renameloading ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
                <div className="w-full mt-4">
                  <input
                    type="text"
                    placeholder="Add User to group"
                    className="w-full p-2 mb-1 border border-gray-300 rounded"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center mt-4">
                    <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
                )}
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => handleRemove(user)}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;