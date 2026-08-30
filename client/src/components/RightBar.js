import React, { useEffect, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../zustand';


const RightBar = ({ onlineUsers, user }) => {
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const navigate = useNavigate();
    const token = useUserStore(s => s.token);
    
    useEffect(() => {
        try {
            const getFollowings = async () => {
                const res = await axios.get(`/users/${user?._id}/followings`);
                setFriendList(res.data);
            }
            if(user?._id) getFollowings();
        } catch (err) {
            console.log(err)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id])
    
    useEffect(() => {
        setOnlineFriends(friendList.filter(f => onlineUsers.includes(f?._id)))
    }, [friendList, onlineUsers])

    const handleMsg = async ({ uid }) => {
        try {
            const res = await axios.post(`/conv`, {
                senderId: user._id,
                receiverId: uid
            },
                {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            navigate(`/messenger/${res.data[0]._id}`)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className='w-1/4 p-4 overflow-y-auto hidden lg:block h-full border-l border-slate-200/60 bg-slate-50/50'>
            {/* online friends widget */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 px-1">
                   <h2 className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Online Now</h2>
                   <span className="flex h-2.5 w-2.5 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                   </span>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3" >
                    <ul className='flex flex-col gap-1'>
                        {
                            onlineFriends.length === 0 &&
                            <div className="py-6 flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-medium text-slate-400">No friends online</span>
                                <span className="text-xs text-slate-300 mt-1">Check back later</span>
                            </div>
                        }
                        {
                            onlineFriends.map(i => (
                                <div key={i._id} className='flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors group'>
                                    <Link to={`/profile/${i._id}`} className="flex gap-3 items-center cursor-pointer flex-1 overflow-hidden">
                                        <div className="relative shrink-0">
                                            <img
                                                className='h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-emerald-100 transition-all'
                                                src={i.profilePic}
                                                alt="" />
                                            <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white'></span>
                                        </div>
                                        <span className="font-medium text-slate-700 text-sm truncate">{i.fullname || "Loading..."}</span>
                                    </Link>
                                    <button
                                        onClick={() => handleMsg({ uid: i._id })}
                                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                    >
                                        <ChatIcon fontSize="small" />
                                    </button>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default RightBar