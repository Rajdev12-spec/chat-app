import type React from "react"
import { useState } from "react"
import { useGetMessageQuery } from "../../services/mesage.service";
import { useGetAllUsersQuery, useGetProfileQuery } from "../../services/user.service";
import { useAppDispatch } from "../../hooks/redux";
import { logout } from "../../features/authSlice";
import { useSignOutMutation } from "../../services/auth.service";

const Chat = () => {
    const [text, setText] = useState("");
    const [messageList, setMessageList] = useState([]);
    const dispatch = useAppDispatch();
    const [signOut] = useSignOutMutation();
    const [conversationId, setConversationId] = useState<string | null>(null);

    const { isLoading, data } = useGetMessageQuery(conversationId!, {
        skip: !conversationId
    });

    const { isLoading: userLoading, data: usersData } = useGetAllUsersQuery();
    console.log('usersData :', usersData);



    const { isLoading: profileLoading, data: profileData } = useGetProfileQuery();
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        console.log('e :', e);
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }
        setMessageList((prev) => [...prev, text])
        setText("")
    }

    const handleTextChagne = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setText(e.currentTarget.value)
    }
    const handleLogOut = () => {
        signOut()
        dispatch(logout())
    }

    return (
        <div className="h-screen">

            <div className="h-full flex">
                <div className="w-1/4  bg-gray-100 p-4">
                    <h2 className="font-bold mb-4">Users</h2>
                    {usersData?.data?.map(user => {
                        return <p>{user?.firstName}</p>
                    })
                    }
                </div>
                <div>
                    <button onClick={handleLogOut}>LogOut</button>
                </div>
                {/* Chat Section */}
                <div className="flex flex-col flex-1">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                        <p className="flex justify-end">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-lg">
                                Hi
                            </span>
                        </p>

                        <p>
                            <span className="bg-gray-300 px-3 py-1 rounded-lg">
                                Hello
                            </span>
                        </p>

                        {messageList?.map((msg, index) => (
                            <p key={index}>
                                <span className="bg-gray-300 px-3 py-1 rounded-lg">
                                    {msg}
                                </span>
                            </p>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white">
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Enter your message..."
                                    className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    name="text"
                                    autoFocus
                                    value={text}
                                    onChange={handleTextChagne}
                                />
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    type="submit"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Chat
