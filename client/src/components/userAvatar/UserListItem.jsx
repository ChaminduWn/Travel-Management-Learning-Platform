import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center w-full p-3 mb-2 transition-colors duration-300 bg-gray-100 rounded-lg cursor-pointer hover:bg-green-500 hover:text-white"
    >
      <img
        className="w-8 h-8 mr-2 rounded-full"
        src={user.pic}
        alt={user.name}
      />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs">
          <strong>Email: </strong>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;