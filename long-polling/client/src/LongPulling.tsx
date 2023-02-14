import {FC, useEffect, useState} from 'react';
import {IMessage} from "./types/IMessage";
import axios from "axios";

export const LongPulling: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [value, setValue] = useState("")

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        try {
            const {data} = await axios.get("http://localhost:5001/get-messages")
            setMessages(prevState => [data, ...prevState])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }

    const sendMessage = async () => {
        await axios.post("http://localhost:5001/new-messages", {
            message: value,
            id: Date.now()
        })
    }

    return (
        <div className={"flex justify-center"}>
            <div>
                <div className={"rounded w-96 p-10 bg-zinc-700 flex flex-col items-end space-y-3"}>
                    <input
                        type="text"
                        className={"rounded w-full px-2 py-1 bg-zinc-700 outline-none border border-zinc-300/50"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button onClick={sendMessage}
                            className={"bg-zinc-800 px-7 py-2 rounded hover:bg-zinc-900 duration-500"}>Send
                    </button>
                </div>
                <div className={"mt-4 space-y-2"}>
                    {messages.map((mess) => (
                        <div className={"px-6 py-2 rounded border border-zinc-400/50"} key={mess.id}>{mess.message}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
