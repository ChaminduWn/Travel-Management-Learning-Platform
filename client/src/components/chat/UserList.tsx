import { User } from '../../type';

interface UserListProps {
    participants: User[];
}

export default function UserList({ participants }: UserListProps) {
    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Participants</h3>
            <ul className="space-y-2">
                {participants.map((user) => (
                    <li key={user.id} className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-center w-10 h-10 text-gray-900 bg-blue-200 rounded-full dark:text-gray-100 dark:bg-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}