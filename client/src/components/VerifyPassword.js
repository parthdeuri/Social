import React, { useState } from 'react'
import { useUserStore } from '../zustand'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import CloseIcon from '@mui/icons-material/Close';

const VerifyPassword = ({ newUser, setSave }) => {
    const user = useUserStore(s => s.user)
    const token = useUserStore(s => s.token)
    const setUser = useUserStore(s => s.setUser)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const passwordValue = e.target.password.value;
            const res = await axios.post('/auth/verify', { password: passwordValue },
                { headers: { "Authorization": `Bearer ${token}` } })
            if (res.status === 200) {
                const dpData = new FormData();
                dpData.append("image", newUser.profilePic);
                dpData.append("userId", user._id);
                dpData.append("type", "profile");
                const coverData = new FormData();
                coverData.append("image", newUser.coverPic);
                coverData.append("userId", user._id);
                coverData.append("type", "cover");
                if (newUser.profilePic) {
                    const { profilePic, ...rest } = newUser;
                    await axios.put(`/users/${user._id}/upload`, dpData, {
                        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                    });
                    newUser = rest;
                }
                if (newUser.coverPic) {
                    const { coverPic, ...rest } = newUser;
                    await axios.put(`/users/${user._id}/upload`, coverData, {
                        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                    });
                    newUser = rest;
                }
                const res2 = await axios.put(`/users/${user._id}`, newUser,
                    { headers: { "Authorization": `Bearer ${token}` } })
                setTimeout(() => {
                    toast.success("Updated successfully", {
                        style: { borderRadius: '12px', background: '#fff', color: '#1e293b' }
                    })
                    setUser(res2.data);
                }, 10)
                navigate(`/profile/${res2.data._id}`);
            } else {
                toast.error(res.data)
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data || "An error occurred");
        }
        setLoading(false);
    }
    
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in'>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl w-full max-w-sm flex flex-col shadow-2xl border border-slate-100 relative">
                
                <button
                    type="button"
                    onClick={() => setSave(false)}
                    className='absolute top-4 right-4 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-500 rounded-full p-2 transition-colors'>
                    <CloseIcon fontSize="small" />
                </button>
                
                <div className="flex flex-col items-center mb-6 mt-2">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-xl text-slate-800">Verify Identity</h2>
                    <p className='text-sm text-slate-500 text-center mt-1'>Please enter your password to save these changes.</p>
                </div>
                
                <div className="mb-6">
                    <input
                        className='w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-indigo-200 focus:ring-2 ring-indigo-50 transition-all text-slate-700 placeholder-slate-400 focus:outline-none'
                        placeholder='Enter your password'
                        type="password"
                        name="password"
                        required
                    />
                </div>
                
                <button
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center
                    ${loading 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        "Confirm Changes"
                    )}
                </button>
            </form>
        </div>
    )
}

export default VerifyPassword