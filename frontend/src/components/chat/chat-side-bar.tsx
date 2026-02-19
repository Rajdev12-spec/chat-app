import type { UserData } from "../../interfaces/auth.interface";
import deaultProfile from "../../assets/images/default-user.png";

interface ChatSideBarProps {
    usersData: UserData[];
    handleUserClick: (userId: string) => void;
    handleLogOut: () => void;
}

const ChatSideBar = ({ usersData, handleUserClick, handleLogOut }: ChatSideBarProps) => {
    return (
        <div className="w-72 bg-white  hidden md:flex flex-col">

            {/* Sidebar Header */}
            <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-800">
                    Messages
                </h2>
            </div>

            {/* Users */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                {usersData?.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer group"
                    >
                        <img
                            src={user?.avatar || deaultProfile}
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="p-4">
                <button
                    onClick={handleLogOut}
                    className="w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-black transition"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default ChatSideBar
