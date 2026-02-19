import { SendIcon } from "../../assets/icons";

interface SendMessageBoxProps {
    handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    text: string;
    isSendingMessage: boolean;
    handleTextChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
}
const SendMessageBox = ({ handleSubmit, text, isSendingMessage, handleTextChange }: SendMessageBoxProps) => {
    return (

        <div className="bg-white border-t px-6 py-4">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-black transition">

                    <input
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Write a message..."
                        className="flex-1 bg-transparent outline-none text-sm"
                    />

                    <button
                        type="submit"
                        disabled={isSendingMessage}
                        className="bg-black text-white px-5 py-2 rounded-full text-sm hover:scale-105 transition disabled:opacity-50"
                    >
                        <SendIcon className="w-full" />
                    </button>
                </div>
            </form>
        </div>

    )
}

export default SendMessageBox
