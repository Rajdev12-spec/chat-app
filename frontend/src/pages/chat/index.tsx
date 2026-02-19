import type React from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatHeeader from "../../components/chat/chat-header";
import ChatSideBar from "../../components/chat/chat-side-bar";
import MessageList from "../../components/chat/message-list";
import SendMessageBox from "../../components/chat/send-message-box";
import { logout } from "../../features/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import { useSignOutMutation } from "../../services/auth.service";
import { useCreateConversationMutation } from "../../services/conversation.service";
import { useGetMessageQuery, useSendMessageMutation } from "../../services/mesage.service";
import { useGetAllUsersQuery, useGetProfileQuery } from "../../services/user.service";
export const socket = io("http://localhost:5000", {
    withCredentials: true,
});

const Chat = () => {
    const [text, setText] = useState("");
    const dispatch = useAppDispatch();
    const [signOut] = useSignOutMutation();
    const [conversationId, setConversationId] = useState<string | null>(null);

    const { data } = useGetMessageQuery(conversationId!, {
        skip: !conversationId
    });
    const { data: usersData } = useGetAllUsersQuery();
    const { data: profileData } = useGetProfileQuery();
    const [createConversation] = useCreateConversationMutation()
    const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation()
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (data?.messages) {
            setMessages(data.messages);
        }
    }, [data]);

    useEffect(() => {
        if (conversationId) {
            socket.emit("joinConversation", conversationId);
        }
    }, [conversationId]);

    useEffect(() => {
        socket.on("newMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("newMessage");
        };
    }, []);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }
        sendMessage({ conversationId: conversationId!, text: trimmedText })
            .unwrap()
            .then(() => {
                setText("");
            });
    }

    const handleTextChagne = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setText(e.currentTarget.value)
    }
    const handleLogOut = () => {
        signOut()
        dispatch(logout())
    }

    const handleUserClick = (userId: string) => {
        createConversation(userId)
            .unwrap()
            .then((response) => {
                setConversationId(response?.conversation?._id || null);
            })
            .catch((error) => {
                console.error("Failed to create conversation:", error);
            });
    }

    return (
        <div className="h-screen flex bg-gray-100">
            <ChatSideBar usersData={usersData?.data} handleLogOut={handleLogOut} handleUserClick={handleUserClick} />

            {/* CHAT AREA */}
            <div className="flex flex-1 flex-col">
                <ChatHeeader />
                <MessageList conversationId={conversationId} messages={messages} profileData={profileData?.data} />

                {/* Input */}
                {
                    conversationId && <SendMessageBox handleSubmit={handleSubmit} text={text} isSendingMessage={isSendingMessage} handleTextChange={handleTextChagne} />
                }

            </div>
        </div>
    )
}

export default Chat
