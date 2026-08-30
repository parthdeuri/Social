import React, { useEffect, useState } from 'react'
import ShareIcon from '@mui/icons-material/Share';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import axios from 'axios';
import { useUserStore } from '../zustand';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


const FollowUsers = () => {
    const user = useUserStore(s => s.user);
    const [list, setList] = useState([]);

    useEffect(() => {
        const searchUsers = async () => {
            const res = await axios.get(`/users/search?q=.`)
            const unknowns = res.data.filter(u => !user.followings.includes(u._id) && u._id !== user._id)
            setList(unknowns);
        }
        searchUsers();
    }, [user._id, user.followings])

    const handleFollow = async ({ currProfile }) => {
        try {
            if (!user.followings.includes(currProfile?._id)) {
                await axios.post(`/users/${currProfile?._id}/follow`, { userId: user._id })
                user.followings.push(currProfile?._id);
                toast.success(`Followed ${currProfile.username} successfully`, {
                    style: { borderRadius: '12px', background: '#fff', color: '#1e293b' }
                })
            } else {
                toast("You already follow this user");
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleCopy = async ({ uid }) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/profile/${uid}`)
            toast.success("Profile link copied!", {
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' }
            })
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <div className="mt-8 mb-4 max-w-3xl mx-auto px-4 lg:px-0">
            <div className="flex items-center gap-4 mb-6 px-2">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className='text-sm font-bold text-slate-400 uppercase tracking-widest'>Follow Users to see their Posts</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            
            {list.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border border-slate-100 text-slate-500">
                    <span className="text-3xl mb-2">🤷‍♂️</span>
                    <span className="font-semibold text-slate-600">You're all caught up!</span>
                    <span className="text-sm">No new users left to follow.</span>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((i) => (
                    <div key={i._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                        
                        <Link to={`/profile/${i._id}`} className="flex items-center gap-3">
                            <img
                                className='h-14 w-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all'
                                src={i.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"} 
                                alt="" 
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {i.username}
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                    {i.followers?.length || 0} Followers
                                </span>
                            </div>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleCopy({ uid: i._id })}
                                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                title="Share Profile"
                            >
                                <ShareIcon fontSize="small" />
                            </button>
                            <button
                                onClick={() => handleFollow({ currProfile: i })}
                                className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                                title="Follow User"
                            >
                                <PersonAddAlt1Icon fontSize="small" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default FollowUsers