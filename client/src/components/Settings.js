import React from 'react'
import { useUserStore } from '../zustand'
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import PasswordIcon from '@mui/icons-material/Password';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

const Settings = ({ socket, setSettings }) => {
    const user = useUserStore(s => s.user);
    const setUser = useUserStore(s => s.setUser);
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await socket.emit("logout", user._id);
            await setUser(null);
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div 
            onClick={() => setSettings(false)}
            className='absolute -right-2 top-12 z-50 min-w-[280px] animate-fade-in'>
            <div className="bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-2xl p-3 flex flex-col gap-2 relative before:content-[''] before:absolute before:-top-2 before:right-6 before:w-4 before:h-4 before:bg-white before:border-l before:border-t before:border-slate-100 before:rotate-45 before:rounded-sm">
                
                {/* User Header */}
                <Link to={`/profile/${user._id}`} className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group">
                    <img
                        className='h-12 w-12 rounded-full border-2 border-slate-100 object-cover group-hover:border-indigo-200 transition-colors'
                        src={user?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                        alt="Profile" />
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{user?.username}</span>
                        <span className="text-xs font-medium text-slate-400">View your profile</span>
                    </div>
                </Link>
                
                <hr className="border-t border-slate-100 my-1 mx-2" />
                
                {/* Menu Items */}
                <div className="flex flex-col gap-1">
                    <Link to={'/editprofile'} className="p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex gap-3 items-center transition-colors">
                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500"><EditIcon fontSize="small"/></div>
                        <span>Edit Profile</span>
                    </Link>
                    
                    <Link to={'/messenger'} className="md:hidden p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex gap-3 items-center transition-colors">
                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500"><ChatIcon fontSize="small"/></div>
                        <span>Messenger</span>
                    </Link>
                    
                    <div onClick={() => navigate('/change-password')} className="p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex gap-3 items-center transition-colors">
                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500"><PasswordIcon fontSize="small"/></div>
                        <span>Change Password</span>
                    </div>
                    
                    <Link to={'/confirm-delete'} className="p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 cursor-pointer flex gap-3 items-center transition-colors group">
                        <div className="bg-slate-100 group-hover:bg-rose-100 p-1.5 rounded-lg text-slate-500 group-hover:text-rose-500 transition-colors"><DeleteForeverIcon fontSize="small"/></div>
                        <span>Delete Account</span>
                    </Link>
                    
                    <div className="p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex gap-3 items-center transition-colors">
                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500"><HelpIcon fontSize="small"/></div>
                        <span>Help & Support</span>
                    </div>
                    
                    <Link to={"/about"} className="p-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer flex gap-3 items-center transition-colors">
                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500"><InfoIcon fontSize="small"/></div>
                        <span>About</span>
                    </Link>
                </div>
                
                <hr className="border-t border-slate-100 my-1 mx-2" />
                
                {/* Logout Button */}
                <button onClick={handleLogout} className='mt-1 mx-2 p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm'>
                    <LogoutIcon fontSize="small"/>
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    )
}

export default Settings