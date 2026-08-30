import React, { useState } from 'react'
import { useUserStore } from '../../zustand'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';

const ChangePassword = () => {
    const user = useUserStore(s => s.user)
    const token = useUserStore(s => s.token);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currPswd, setCurrPswd] = useState("");
    const [newPswd, setNewPswd] = useState("");
    const [cnfPswd, setCnfPswd] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (newPswd === cnfPswd) {
                const res = await axios.post('/auth/verify', { userId: user._id, password: currPswd }, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (res.status === 200) {
                    await axios.put(`auth/change/${user.email}`, { password: newPswd })
                    toast.success("Password changed successfully", {
                        style: { borderRadius: '12px', background: '#fff', color: '#1e293b' }
                    });
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    toast.error(res.data)
                }
            } else {
                toast.error("New passwords do not match!")
            }
        } catch (err) {
            toast.error(err.response?.data || "An error occurred!")
        }
        setLoading(false);
    }
    
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in'>
            <Toaster position='top-center' reverseOrder={false} />
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl w-full max-w-sm flex flex-col shadow-2xl border border-slate-100 relative">
                
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className='absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-2 transition-colors flex items-center justify-center'>
                    <CloseIcon fontSize="small" />
                </button>
                
                <div className="flex flex-col items-center mb-6 mt-2">
                    <div className="h-16 w-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                        <LockResetIcon fontSize="large" />
                    </div>
                    <h2 className="font-bold text-xl text-slate-800">Change Password</h2>
                    <p className='text-sm text-slate-500 text-center mt-2'>Secure your account with a new password.</p>
                </div>
                
                <div className="flex flex-col gap-3 mb-6">
                    <input
                        className='w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-indigo-200 focus:ring-2 ring-indigo-50 transition-all text-slate-700 placeholder-slate-400 focus:outline-none'
                        placeholder='Current Password'
                        type="password"
                        required
                        onChange={(e) => setCurrPswd(e.target.value)}
                    />
                    <input
                        className='w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-indigo-200 focus:ring-2 ring-indigo-50 transition-all text-slate-700 placeholder-slate-400 focus:outline-none'
                        placeholder='New Password'
                        type="password"
                        required
                        onChange={(e) => setNewPswd(e.target.value)}
                    />
                    <input
                        className='w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-indigo-200 focus:ring-2 ring-indigo-50 transition-all text-slate-700 placeholder-slate-400 focus:outline-none'
                        placeholder='Confirm New Password'
                        type="password"
                        required
                        onChange={(e) => setCnfPswd(e.target.value)}
                    />
                </div>
                
                <button
                    disabled={loading || !currPswd || !newPswd || !cnfPswd}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center
                    ${(loading || !currPswd || !newPswd || !cnfPswd)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Changing...</span>
                        </div>
                    ) : (
                        "Change Password"
                    )}
                </button>
            </form>
        </div>
    )
}

export default ChangePassword