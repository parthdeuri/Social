import { useEffect, useState } from "react"
import { useUserStore } from "../zustand"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CoverProfile = ({ uid, userProfile }) => {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const [owner, setOwner] = useState(false);
    const [currProfile, setCurrProfile] = useState(userProfile);
    const [followText, setFollowText] = useState(" ");
    const navigate = useNavigate();

    const fetchUser = async () => {
        const res = await axios.get(`/users/${uid}`);
        setCurrProfile(res.data)
    }
    
    useEffect(() => {
        try {
            fetchUser();
        } catch (err) {
            console.log(err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid])

    useEffect(() => {
        if (user?._id === currProfile?._id) {
            setOwner(true);
        } else {
            setOwner(false);
            if (!user.followings.includes(currProfile?._id))
                setFollowText("Follow");
            else
                setFollowText("Unfollow");
        }
    }, [currProfile?._id, user?._id, user.followings])

    const handleFollow = async () => {
        try {
            if (!user.followings.includes(currProfile?._id)) {
                await axios.post(`/users/${currProfile?._id}/follow`, { userId: user._id })
                user.followings.push(currProfile?._id);
                setFollowText("Unfollow");
            } else {
                await axios.post(`/users/${currProfile?._id}/unfollow`, { userId: user._id })
                setFollowText("Follow");
                user.followings = user.followings.filter(e => e !== currProfile._id);
            }
            fetchUser();
        } catch (err) {
            console.log(err)
        }
    }
    
    const handleMsg = async () => {
        try {
            const res = await axios.post(`/conv`, {
                senderId: user?._id,
                receiverId: currProfile?._id
            }, { headers: { "Authorization": `Bearer ${token}` } })
            navigate(`/messenger/${res.data[0]?._id}`);
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <div className="w-full relative bg-white pb-6 rounded-b-3xl shadow-sm border-b border-slate-200">
            {/* Cover Photo */}
            <div className="w-full h-48 md:h-72 relative">
                <img 
                    className='w-full h-full object-cover object-center rounded-b-xl md:rounded-b-3xl shadow-inner'
                    src={currProfile?.coverPic || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"} 
                    alt="Cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-b-xl md:rounded-b-3xl"></div>
            </div>

            {/* Profile Info Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-16 md:-mt-20">
                {/* Avatar */}
                <div className="relative shrink-0 z-10 group cursor-pointer">
                    <img
                        className='h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-lg bg-white ring-2 ring-transparent group-hover:ring-indigo-100 transition-all'
                        src={currProfile?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                        alt="Profile" 
                    />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full pb-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 pt-2 md:pt-0">
                        <h1 className="font-extrabold text-3xl text-slate-800 tracking-tight">
                            {currProfile?.fullname || "Loading..."}
                        </h1>
                        <p className="font-medium text-slate-500 mt-1 mb-2 text-sm flex items-center gap-1">
                            @{currProfile?.username || "loading"}
                            {currProfile?.city && (
                                <span className="flex items-center ml-2 before:content-['•'] before:mr-2 before:text-slate-300">
                                   <LocationOnIcon fontSize="inherit" className="mr-0.5 text-slate-400" /> {currProfile.city}
                                </span>
                            )}
                        </p>
                        
                        {currProfile?.desc && (
                            <p className="text-slate-600 max-w-lg text-sm leading-relaxed mt-2 hidden md:block">
                                {currProfile.desc}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center md:justify-end gap-3 shrink-0 mb-2 md:mb-1 z-10">
                        {owner ? (
                            <button
                                onClick={() => navigate('/editprofile')}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95">
                                <EditIcon fontSize="small" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleFollow}
                                    className={`px-5 py-2.5 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95 ${
                                        followText === "Unfollow" 
                                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700" 
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}>
                                    {followText === "Follow" && <PersonAddAlt1Icon fontSize="small" />}
                                    <span>{followText}</span>
                                </button>
                                <button
                                    onClick={handleMsg}
                                    className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95">
                                    <ChatIcon fontSize="small" className="text-indigo-500" />
                                    <span>Message</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {currProfile?.desc && (
                <div className="px-6 md:hidden text-center text-slate-600 text-sm mt-4 leading-relaxed">
                    {currProfile.desc}
                </div>
            )}
        </div>
    )
}

export default CoverProfile