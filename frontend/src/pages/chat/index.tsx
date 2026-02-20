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
import {
    messageApi,
    useGetMessageQuery,
    useSendMessageMutation
} from "../../services/mesage.service";
import {
    useGetAllUsersQuery,
    useGetProfileQuery
} from "../../services/user.service";

export const socket = io("http://localhost:5000", {
    withCredentials: true,
});

const Chat = () => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);

    const { data } = useGetMessageQuery(conversationId as string, {
        skip: !conversationId,
        refetchOnMountOrArgChange: true,
    });

    const messages = data?.messages ?? [];
    const { data: usersData } = useGetAllUsersQuery();
    const { data: profileData } = useGetProfileQuery();
    const [createConversation] = useCreateConversationMutation();
    const [sendMessage, { isLoading: isSendingMessage }] =
        useSendMessageMutation();
    const [signOut] = useSignOutMutation();


    useEffect(() => {
        if (!conversationId) return;

        socket.emit("joinConversation", conversationId);

        return () => {
            socket.emit("leaveConversation", conversationId);
        };
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const handler = (newMessage: any) => {
            if (newMessage.conversation !== conversationId) return;

            dispatch(
                messageApi.util.updateQueryData(
                    "getMessage",
                    conversationId,
                    (draft: any) => {
                        draft.messages.push(newMessage);
                    }
                )
            );
        };

        socket.on("newMessage", handler);

        return () => {
            socket.off("newMessage", handler);
        };
    }, [conversationId, dispatch]);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || !conversationId) return;

        sendMessage({
            conversationId,
            text: trimmedText,
        })
            .unwrap()
            .then(() => {
                setText("");
            });
    };

    const handleTextChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setText(e.currentTarget.value);
    };

    const handleLogOut = () => {
        signOut();
        dispatch(logout());
    };

    const handleUserClick = (userId: string) => {
        createConversation(userId)
            .unwrap()
            .then((response) => {
                setConversationId(response?.conversation?._id || null);
            })
            .catch((error) => {
                console.error("Failed to create conversation:", error);
            });
    };

    return (
        <div className="h-screen flex bg-gray-100">
            <ChatSideBar
                usersData={usersData?.data}
                handleLogOut={handleLogOut}
                handleUserClick={handleUserClick}
            />

            <div className="flex flex-1 flex-col">
                <ChatHeeader />

                <MessageList
                    conversationId={conversationId}
                    messages={messages}
                    profileData={profileData?.data}
                />

                {conversationId && (
                    <SendMessageBox
                        handleSubmit={handleSubmit}
                        text={text}
                        isSendingMessage={isSendingMessage}
                        handleTextChange={handleTextChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;