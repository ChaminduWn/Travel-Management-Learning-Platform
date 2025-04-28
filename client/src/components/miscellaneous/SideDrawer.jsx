import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import ProfileModal from "../../pages/Profile";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const showToast = (title, status) => {
    // Simple toast implementation
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 left-4 p-4 rounded-md text-white ${
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

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      showToast("Please Enter something in search", "warning");
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
      showToast("Failed to Load the Search Results", "error");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      showToast("Error fetching the chat", "error");
      setLoadingChat(false);
    }
  };

  // Custom notification badge component
  const NotificationBadge = ({ count }) => {
    if (count === 0) return null;
    
    return (
      <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white transition-transform duration-300 transform scale-100 bg-red-500 rounded-full">
        {count > 9 ? '9+' : count}
      </span>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between w-full p-2 bg-white border-b-4">
        <div className="relative">
          <button 
            className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" 
            onClick={() => setIsDrawerOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden md:inline">Search User</span>
          </button>
        </div>

        <div className="text-2xl font-['Work_sans']">Talk-A-Tive</div>

        <div className="flex items-center">
          <div className="relative mr-2">
            <button 
              className="relative p-1"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <div className="absolute -top-1 -right-1">
                <NotificationBadge count={notification.length} />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 z-50 w-56 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-2 py-1">
                  {!notification.length && "No New Messages"}
                  {notification.map((notif) => (
                    <div
                      key={notif._id}
                      className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(notification.filter((n) => n !== notif));
                        setIsNotificationsOpen(false);
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(user, notif.chat.users)}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="flex items-center bg-white"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img
                src={user.pic}
                alt={user.name}
                className="object-cover w-8 h-8 rounded-full cursor-pointer"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div 
                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      ProfileModal({ user });
                      setIsProfileOpen(false);
                    }}
                  >
                    My Profile
                  </div>
                  <hr className="my-1" />
                  <div 
                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      logoutHandler();
                      setIsProfileOpen(false);
                    }}
                  >
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="absolute top-0 left-0 z-50 w-64 h-full bg-white shadow-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Search Users</h2>
            </div>
            <div className="p-4">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                  className="px-4 text-white bg-blue-500 rounded-r"
                  onClick={handleSearch}
                >
                  Go
                </button>
              </div>
              <div>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;