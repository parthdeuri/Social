import React, { useEffect, useState } from 'react'
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ChatIcon from '@mui/icons-material/Chat';
import { useUserStore } from '../zustand';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InfoIcon from '@mui/icons-material/Info';
import { Link, useLocation } from 'react-router-dom';

const LeftBar = () => {
    const leftList = [
        {
            id: 1,
            icon: <RssFeedIcon fontSize="small" />,
            text: "Feed",
            to: "/"
        },
        {
            id: 2,
            icon: <ChatIcon fontSize="small" />,
            text: "Chat",
            to: "/messenger"
        },
        {
            id: 3,
            icon: <EditIcon fontSize="small" />,
            text: "Edit Profile",
            to: "/editprofile"
        },
        {
            id: 4,
            icon: <PersonAddAlt1Icon fontSize="small" />,
            text: "Find Users",
            to: "/find-users"
        },
        {
            id: 5,
            icon: <InfoIcon fontSize="small" />,
            text: "About",
            to: "/about"
        },
    ];
    
    const user = useUserStore(s => s.user);
    const [friendList, setFriendList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        try {
            const fetchFriend = async () => {
                const res = await axios.get(`/users/${user?._id}/followings`);
                setFriendList(res.data);
            }
            if(user?._id) fetchFriend();
        } catch (err) {
            console.log(err)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id])

    const FriendItem = ({ f }) => {
        return (
            <Link to={`/profile/${f?._id}`} className='flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm hover:scale-[1.02] border border-transparent hover:border-slate-100 transition-all duration-200 mb-1 group'>
                <div className="relative">
                   <img
                       className='h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all'
                       src={f?.profilePic}
                       alt="" />
                </div>
                <span className="font-medium text-slate-700 text-sm">{f?.fullname || "Loading..."}</span>
            </Link>
        )
    }

    return (
        <div className='w-2/5 md:w-1/4 lg:w-1/5 p-4 overflow-y-auto hidden md:block h-full border-r border-slate-200/60 bg-slate-50/50' >
            <div className="flex flex-col h-full">
                <nav className='flex flex-col gap-1 mb-6'>
                    {
                        leftList.map(item => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link 
                                    to={item.to} 
                                    key={item.id} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                                        isActive 
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                                            : 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-slate-100'
                                    }`}
                                >
                                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-600' : 'group-hover:scale-110 text-slate-400 group-hover:text-indigo-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.text}</span>
                                </Link>
                            );
                        })
                    }
                </nav>

                <hr className='border-t border-slate-200 mb-6 mx-2' />

                <div className='flex-1'>
                    <h2 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2'>Following</h2>
                    <div className='flex flex-col'>
                        {friendList.length === 0 && <span className="text-sm text-slate-500 italic px-2">Not following anyone yet.</span>}
                        {
                            friendList.map(f => (
                                <FriendItem key={f?._id} f={f} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftBar