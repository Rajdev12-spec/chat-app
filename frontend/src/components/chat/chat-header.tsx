import type { UserData } from "../../interfaces/auth.interface"
import deaultProfile from "../../assets/images/default-user.png";


interface ChatHeeaderProps {
    selectedUser: UserData | null
}
const ChatHeeader = ({ selectedUser }: ChatHeeaderProps) => {
    return (
        <div className="h-16 bg-white  flex items-center px-6 justify-between">
            <img
                src={selectedUser?.avatar || deaultProfile}
                className="w-11 h-11 rounded-full object-cover"
            />
            <div
                className="flex-1"
            >
                <h3 className="font-semibold text-gray-800">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                </h3>
            </div>
        </div>
    )
}

export default ChatHeeader
