import { User } from '../../type';

interface UserListProps {
    participants: User[];
}

export default function UserList({ participants }: UserListProps) {
    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold text-black">Participants</h3>
            <ul className="space-y-2">
                {participants.map((user) => (
                    <li key={user.id} className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 text-black bg-teal-200 rounded-full">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-black">{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}