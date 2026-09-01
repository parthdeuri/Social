import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../zustand'
import axios from 'axios'
import MsgLeftListItem from '../../components/MsgLeftListItem'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../App'

const Messenger = () => {
    const setUser = useUserStore(s => s.setUser);
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const [allConv, setAllConv] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const navigate = useNavigate();
    let { convid } = useParams();
    
    useEffect(() => {
        if (convid) {
            setOpenChat(true);
        } else {
            setOpenChat(false);
        }
    }, [convid])
    
    useEffect(() => {
        socket.emit("addUser", user._id);
        const fetchUser = async () => {
            const res = await axios.get(`/users/${user._id}`);
            setUser(res.data);
        }
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        try {
            const getFollowings = async () => {
                const res = await axios.get(`/users/${user._id}/followings`);
                setFriendList(res.data);
            }
            getFollowings();
        } catch (err) {
            console.log(err)
        }
        socket.emit("sendUsers");
        socket.on("getAllUsers", users => {
            setOnlineUsers(
                user.followings.filter(f => users.some(u => u.userId === f))
            );
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, user._id])
    
    useEffect(() => {
        try {
            const fetchConv = async () => {
                const res = await axios.get(`/conv/${user?._id}`,
                    { headers: { "Authorization": `Bearer ${token}` } })
                setAllConv(res.data);
            }
            fetchConv();
        } catch (err) {
            console.log(err)
        }
    }, [token, user])
    
    useEffect(() => {
        setOnlineFriends(friendList.filter(f => onlineUsers.includes(f._id)))
    }, [onlineUsers, friendList])
    
    const handleOnlineClick = async ({ fid }) => {
        try {
            const res = await axios.post('/conv', {
                senderId: user?._id,
                receiverId: fid,
            }, { headers: { "Authorization": `Bearer ${token}` } }
            )
            navigate(`/messenger/${res.data[0]._id}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="h-[calc(100dvh-56px)] bg-slate-50/50 p-2 md:p-4">
            <div className="flex h-full gap-4 max-w-7xl mx-auto">
                <div className={`${openChat ? "hidden" : "flex"} w-full md:flex md:w-1/3 lg:w-1/4 h-full flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden`}>
                    
                    <div className="shrink-0 border-b border-slate-100">
                        <div className="px-4 py-3 flex items-center justify-between bg-slate-50/50">
                            <h1 className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Online Friends</h1>
                        </div>
                        <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide">
                            {
                                onlineFriends.length === 0 &&
                                <div className="w-full text-sm font-medium flex justify-center text-slate-400 italic">
                                    <span>No friends online</span>
                                </div>
                            }
                            {
                                onlineFriends.map(f => (
                                    <div
                                        onClick={() => handleOnlineClick({ fid: f._id })}
                                        key={f._id}
                                        className="relative shrink-0 cursor-pointer group">
                                        <img
                                            className='h-12 w-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-100 transition-all'
                                            src={f.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                                            alt="" />
                                        <span className='absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full'></span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                    <div className="px-4 py-3 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
                        <h1 className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Recent Chats</h1>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        {
                            allConv.length !== 0 ?
                            allConv.map(c => (
                                <div
                                    className="" key={c._id}
                                    onClick={() => {
                                        navigate(`/messenger/${c._id}`)
                                    }}
                                >
                                    <MsgLeftListItem
                                        c={c}
                                        currUser={user}
                                        active={convid === c._id}
                                    />
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-sm">No recent conversations.</span>
                                </div>
                            )
                        }
                    </div>
                </div>
                
                <div className={`${openChat ? "block" : "hidden"} w-full md:block md:w-2/3 lg:w-3/4 h-full`}>
                    {convid ? (
                        <Outlet context={[socket]} />
                    ) : (
                        <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                            <span className="text-lg font-medium text-slate-600 mb-2">Your Messages</span>
                            <span className="text-sm">Select a chat or start a new conversation.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messenger