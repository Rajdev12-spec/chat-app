import emptyChat from "../../assets/images/empty-chat.jpg";
import type { UserData } from "../../interfaces/auth.interface";
import type { MessageData } from "../../interfaces/chat.interface";

interface MessageListProps {
    conversationId: string | null;
    messages: MessageData[];
    profileData: UserData;
}
const MessageList = ({ conversationId, messages, profileData }: MessageListProps) => {

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-linear-to-b from-gray-50 to-gray-100">

            {/* No Conversation Selected */}
            {!conversationId ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <img
                        src={emptyChat}
                        alt="Empty chat"
                        className="w-40 md:w-56 mb-6 opacity-80"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                        Select a conversation
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm">
                        Choose a user from the sidebar to start chatting.
                    </p>
                </div>
            ) : messages.length === 0 ? (

                /* Conversation exists but no messages */
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <img
                        src={emptyChat}
                        alt="No messages"
                        className="w-40 md:w-56 mb-6 opacity-80"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                        No messages yet
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm">
                        Send the first message to start the conversation.
                    </p>
                </div>

            ) : (

                /* Messages */
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isOwn =
                            msg?.sender?._id === profileData?._id;

                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-lg px-5 py-3 rounded-2xl text-sm shadow-sm
                ${isOwn
                                            ? "bg-black text-white rounded-br-sm"
                                            : "bg-white text-gray-800 rounded-bl-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>

            )}
        </div>
    )
}

export default MessageList
