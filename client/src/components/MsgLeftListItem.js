import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { socket } from '../App';

const MsgLeftListItem = ({ c, currUser, active }) => {
    const [friend, setFriend] = useState(null);
    const [newMsg, setNewMsg] = useState(false);
    
    useEffect(() => {
        const friendId = c.members.find(m => m !== currUser._id)
        socket.on("getMsg", data => {
            if (data.senderId === friendId) setNewMsg(true);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const friendId = c.members.find(m => m !== currUser._id)

        try {
            const getFriend = async () => {
                const res = await axios.get(`/users/${friendId}`);
                setFriend(res.data);
            }
            getFriend();
        } catch (err) {
            console.log(err)
        }
    }, [c._id, c.members, currUser._id])
    
    return (
        <>
            {
                friend?.fullname &&

                <div
                    onClick={() => setNewMsg(false)}
                    className={`flex items-center px-4 py-3 gap-3 rounded-xl mb-1 cursor-pointer transition-all border ${
                        active 
                        ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                    }`} 
                >
                    <div className="relative shrink-0">
                        <img
                            className={`h-11 w-11 rounded-full object-cover ring-2 transition-all ${active ? 'ring-indigo-200' : 'ring-slate-100 group-hover:ring-slate-200'}`}
                            src={friend?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                            alt="" />
                        {newMsg && <span className='absolute top-0 right-0 h-3.5 w-3.5 bg-rose-500 border-2 border-white rounded-full animate-bounce'></span>}
                    </div>
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <span className={`font-semibold truncate transition-colors ${active ? 'text-indigo-700' : 'text-slate-700'}`}>
                            {friend?.fullname || ""}
                        </span>
                        <span className={`text-[12px] truncate ${active ? 'text-indigo-500/80' : 'text-slate-400'}`}>
                            {newMsg ? "New message!" : `@${friend?.username || "user"}`}
                        </span>
                    </div>
                </div >
            }
        </>
    )
}

export default MsgLeftListItem