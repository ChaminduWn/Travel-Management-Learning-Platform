import { XMarkIcon } from '@heroicons/react/24/outline';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div className="flex items-center px-2 py-1 m-1 mb-2 text-white bg-purple-500 rounded-lg cursor-pointer">
      <span className="mr-1">{user.name}</span>
      {admin === user._id && <span className="text-xs">(Admin)</span>}
      <button 
        className="pl-1 ml-1 text-xs"
        onClick={handleFunction}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UserBadgeItem;