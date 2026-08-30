import React, { useState } from 'react'
import { useUserStore } from '../zustand';
import axios from 'axios';
import { socket } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmDeleteUser = () => {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const setUser = useUserStore(s => s.setUser);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await socket.emit("logout", user._id);
            await setUser(null);

            navigate('/login');
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`/users/${user._id}/delete`, { userId: user._id }, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            console.log(res.data);
            handleLogout();
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }
    
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in'>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl w-full max-w-sm flex flex-col shadow-2xl border border-slate-100 relative">
                
                <Link
                    to={`/`}
                    className='absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-2 transition-colors flex items-center justify-center'>
                    <CloseIcon fontSize="small" />
                </Link>
                
                <div className="flex flex-col items-center mb-6 mt-2">
                    <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-xl text-slate-800">Delete Account</h2>
                    <p className='text-sm text-slate-500 text-center mt-2'>This action cannot be undone. Please verify your password to permanently delete your account.</p>
                </div>
                
                <div className="mb-6">
                    <input
                        className='w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-rose-200 focus:ring-2 ring-rose-50 transition-all text-slate-700 placeholder-slate-400 focus:outline-none'
                        placeholder='Enter your password'
                        type="password"
                        required
                    />
                </div>
                
                <button
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center
                    ${loading 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-95'}`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        "Permanently Delete"
                    )}
                </button>
                <Link to="/" className="text-center w-full mt-3 text-sm font-semibold text-slate-400 hover:text-slate-600">
                    Cancel
                </Link>
            </form>
        </div>
    )
}

export default ConfirmDeleteUser