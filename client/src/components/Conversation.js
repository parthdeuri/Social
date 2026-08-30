import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { format } from 'timeago.js';
import Close from '@mui/icons-material/Close';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useUserStore } from '../zustand';
import toast from 'react-hot-toast';
import SendIcon from '@mui/icons-material/Send';

const Conversation = () => {
    const currUser = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const [messages, setMessages] = useState(null);
    const [friend, setFriend] = useState(null);
    const [newMsg, setNewMsg] = useState("");
    const [newImg, setNewImg] = useState("");
    const [sending, setSending] = useState(false);
    const [arrivalMsg, setArrivalMsg] = useState([]);
    const [online, setOnline] = useState(false);
    const [currChat, setCurrChat] = useState({});
    let { convid } = useParams();
    const scrollRef = useRef();
    const navigate = useNavigate();
    const [socket] = useOutletContext();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    useEffect(() => {
        socket.emit("addUser", currUser._id);
    }, [currUser._id, socket])

    useEffect(() => {
        socket.on("getMsg", data => {
            setArrivalMsg({
                _id: Date.now(),
                sender: data.senderId,
                text: data.text,
                image: data.image,
                createdAt: Date.now(),
            })
        })
    }, [socket])
    useEffect(() => {

        try {
            const fetchConv = async () => {
                const resC = await axios.get(`/conv/one/${convid}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setCurrChat(resC.data);
            }
            fetchConv();
        } catch (err) {
            console.log(err)
        }
    }, [convid, token])

    useEffect(() => {
        arrivalMsg && currChat?.members?.includes(arrivalMsg.sender) &&
            setMessages(prev => [...prev, arrivalMsg]);
    }, [arrivalMsg, currChat])

    useEffect(() => {
        const friendId = currChat?.members?.find(m => m !== currUser?._id)
        socket.emit("sendUsers");
        socket.on("getAllUsers", users => {
            setOnline(users.some(u => u.userId === friendId));
        })
        try {
            const getFriend = async () => {
                const res = await axios.get(`/users/${friendId}`);
                setFriend(res.data);
            }
            if (friendId !== undefined)
                getFriend();
        } catch (err) {
            console.log(err)
        }
    }, [currChat?.members, currUser?._id, socket])
    useEffect(() => {
        try {
            const getMsgs = async () => {
                const friendId = currChat?.members?.find(m => m !== currUser?._id)
                const res = await axios.post(`/msg/${currChat._id}`,
                    { userId: currUser._id, friendId },
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                setMessages(res.data);
            }
            if (currChat._id !== undefined)
                getMsgs();
        } catch (err) {
            toast.error(err.response?.data || "Error");
        }
    }, [currChat._id, currChat?.members, currUser._id, token])

    const base64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }
    const handleImgChange = async (e) => {
        if(e.target.files && e.target.files[0]){
            const cnvImg = await base64(e.target.files[0]);
            setNewImg(cnvImg);
        }
    }
    const handleNewMessage = async () => {
        try {
            if (newMsg.trim() !== "" || newImg !== "") {

                setSending(true);
                const res = await axios.post(`/msg`, {
                    sender: currUser._id,
                    convId: currChat._id,
                    text: newMsg,
                    image: newImg
                }, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                socket.emit("sendMsg", {
                    senderId: currUser._id,
                    receiverId: friend._id,
                    text: newMsg,
                    image: newImg,
                })
                if (messages)
                    setMessages([...messages, res.data]);
                else
                    setMessages([res.data]);
                if(document.getElementById("msg-inp-text")) document.getElementById("msg-inp-text").value = "";
                if(document.getElementById("msg-inp-img")) document.getElementById("msg-inp-img").value = null;
                setNewImg("");
                setNewMsg("");
                setSending(false);
            }
        } catch (err) {
            console.log(err)
            setSending(false);
        }
    }
    const handleClose = () => {
        if(document.getElementById("msg-inp-img")) document.getElementById("msg-inp-img").value = null;
        setNewImg("");
    }

    const Msg = ({ own, m }) => {
        const [time, setTime] = useState("");
        const handleClick = () => {
            if (time === "") {
                setTime(format(m.createdAt));
            }
            else {
                setTime("");
            }
        }
        return (
            <div className={`flex w-full ${own ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex ${own && "flex-row-reverse"} gap-2 max-w-[80%] md:max-w-[70%]`}>
                    <img
                        className='h-8 w-8 rounded-full object-cover shrink-0 mt-auto shadow-sm ring-2 ring-white'
                        src={own ? currUser?.profilePic : (friend?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg")}
                        alt="" />
                    <div className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
                        <div 
                            onClick={handleClick} 
                            className={`cursor-pointer overflow-hidden p-3 shadow-sm flex flex-col gap-2 ${
                                own 
                                ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm" 
                                : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-bl-sm"
                            }`}
                        >
                            {m.text && <span className='text-[15px] leading-relaxed'>{m.text}</span>}
                            {m.image && (
                                <img
                                    className='max-w-full max-h-[300px] object-cover rounded-xl mt-1'
                                    src={m?.image} alt="" />
                            )}
                        </div>
                        {time && <span className='text-[11px] text-slate-400 mt-1 px-1 transition-all'>{time}</span>}
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white/50 backdrop-blur shrink-0 z-10">
                <Link
                    to={`/profile/${friend?._id}`}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative">
                        <img
                            className='h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all'
                            src={friend?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                            alt="" />
                        {online && <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                    </div>
                    <div className="flex flex-col">
                        <span className='font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors'>{friend?.fullname || "Loading..."}</span>
                        <span className='text-[11px] font-medium text-slate-400'>{online ? "Active now" : "Offline"}</span>
                    </div>
                </Link>
                <button 
                    onClick={() => navigate('/messenger')}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all md:hidden"
                >
                    <CloseIcon />
                </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
                {!messages && (
                    <div className='h-full flex justify-center items-center'>
                        <span className='font-medium text-slate-400'>Loading chat...</span>
                    </div>
                )}
                {messages?.length === 0 && (
                    <div className='h-full flex flex-col justify-center items-center text-slate-400 gap-2'>
                        <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                           <span className="text-2xl text-indigo-300">👋</span>
                        </div>
                        <span className='font-medium text-slate-600'>Say Hello to {friend?.username}!</span>
                        <span className="text-sm">Start the conversation with a nice message.</span>
                    </div>
                )}
                <div className="flex flex-col justify-end min-h-full">
                    {messages?.map(m => (
                        <div key={m?._id} ref={scrollRef}>
                            <Msg m={m} own={m.sender === currUser?._id} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 bg-white border-t border-slate-100 p-4">
                {newImg && (
                    <div className="mb-3 relative w-max">
                        <img src={newImg} alt="" className='h-24 w-auto object-cover rounded-xl border border-slate-200 shadow-sm' />
                        <button
                            onClick={handleClose}
                            className="absolute -top-2 -right-2 bg-white text-slate-500 shadow-sm border border-slate-100 rounded-full p-1 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                            <Close fontSize="small" />
                        </button>
                    </div>
                )}
                
                <div className="flex gap-3 items-end">
                    <label className='cursor-pointer p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-500 transition-colors shrink-0 flex items-center justify-center mb-1'>
                        <AddIcon fontSize="small" />
                        <input
                            onChange={handleImgChange}
                            id="msg-inp-img"
                            className='hidden' type="file" accept="image/*" />
                    </label>
                    <textarea
                        id="msg-inp-text"
                        onChange={(e) => setNewMsg(e.target.value)}
                        value={newMsg}
                        placeholder="Message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleNewMessage();
                            }
                        }}
                        className='flex-1 max-h-32 min-h-[44px] bg-slate-100 hover:bg-slate-200/50 focus:bg-white border border-transparent focus:border-indigo-100 focus:ring-2 ring-indigo-50 rounded-xl px-4 py-2.5 resize-y focus:outline-none transition-all text-slate-700 placeholder-slate-400'
                    />
                    <button
                        onClick={handleNewMessage}
                        disabled={sending || (!newMsg.trim() && !newImg)}
                        className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center transition-all mb-1
                        ${(sending || (!newMsg.trim() && !newImg)) 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95"}`}
                    >
                        <SendIcon fontSize="small" className={sending ? "opacity-50" : "transform translate-x-[1px]"} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Conversation