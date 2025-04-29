import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChat";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  // If user is not yet loaded, show a loading indicator
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full h-[91.5vh] p-2.5">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default Chatpage;