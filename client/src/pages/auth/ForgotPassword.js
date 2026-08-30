import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [otpConfirm, setOtpConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpId, setOtpId] = useState(null);
    const [email, setEmail] = useState("");
    const emailRef = useRef();
    const otp = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const navigate = useNavigate();

    const toastStyle = {
        style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#1e293b',
        }
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            setEmail(emailRef.current.value.trim());
            const res = await axios.get(`/auth/forgot/${emailRef.current.value.trim()}`);
            if (res.data?.msg === "all ok") {
                setOtpId(res.data.otpId);
                toast.success("OTP sent to your email", toastStyle);
                setOtpSent(true);
            } else {
                toast.error(res.data.msg, toastStyle)
            }
        } catch (err) {
            toast.error("An error occurred", toastStyle);
        }
        setLoading(false);
    }
    
    const confirmOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (otp.current.value.length === 6) {
                const res = await axios.post(`/auth/otp`, {
                    otpId,
                    otp: otp.current.value,
                    email
                })
                if (res.data.msg === "success") {
                    setOtpConfirm(true);
                }
            } else {
                toast.error("OTP must be exactly 6 digits", toastStyle)
            }
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("OTP mismatch", toastStyle);
            } else {
                toast.error("An error occurred", toastStyle)
            }
        }
        setLoading(false);
    }
    
    const handleWrongEmail = () => {
        setEmail("");
        setOtpSent(false);
        setOtpConfirm(false);
    }
    
    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/auth/forgot/${email}`);
            if (res.data?.msg === "all ok") {
                setOtpId(res.data.otpId);
                toast.success("OTP resent", toastStyle)
            } else {
                toast.error(res.data.msg, toastStyle)
            }
        } catch (err) {
            toast.error("An error occurred", toastStyle)
        }
        setLoading(false);
    }
    
    const InputArea = () => {
        return (
            <form className="flex flex-col gap-4 animate-fade-in" onSubmit={sendOtp}>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
                    <p className="text-slate-500 mb-6 text-sm">Enter your email to receive a reset code.</p>
                    <input type="email"
                        className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
                        placeholder='Email address'
                        required
                        autoFocus
                        ref={emailRef}
                    />
                </div>
                <button
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] mt-2
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </form>
        )
    }

    const OtpArea = () => {
        return (
            <form className="flex flex-col gap-4 animate-fade-in" onSubmit={confirmOtp}>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Email</h2>
                    <p className='text-slate-500 mb-6 text-sm leading-relaxed'>
                        We sent a 6-digit code to <span className="font-semibold text-indigo-600">{email}</span>.
                    </p>
                    
                    <input type="number"
                        className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium tracking-widest text-center text-xl'
                        placeholder='------'
                        required
                        autoFocus
                        ref={otp}
                    />
                </div>
                
                <div className="flex justify-between items-center text-sm font-medium mt-1 mb-2">
                    <button type="button" onClick={handleWrongEmail} className='text-slate-400 hover:text-slate-600 transition-colors'>
                        Wrong email?
                    </button>
                    <button type="button" onClick={handleResendOtp} className='text-indigo-500 hover:text-indigo-600 transition-colors'>
                        Resend OTP
                    </button>
                </div>
                
                <button
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] 
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                >
                    {loading ? "Verifying..." : "Confirm OTP"}
                </button>
            </form>
        )
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const pswd = password.current.value;
            const cnfpswd = confirmPassword.current.value;
            if (pswd === cnfpswd) {
                await axios.put(`/auth/change/${email}`, {
                    password: pswd
                })
                toast.success("Password changed successfully", toastStyle);
                setTimeout(() => {
                   navigate('/login'); 
                }, 1000);
            } else {
                toast.error("Passwords do not match", toastStyle);
            }
        } catch (err) {
            toast.error("An error occurred", toastStyle);
        }
    }
    
    const PasswordArea = () => {
        return (
            <form className="flex flex-col gap-4 animate-fade-in" onSubmit={handlePasswordReset}>
                <div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">New Password</h2>
                   <p className="text-slate-500 mb-6 text-sm">Create a strong new password.</p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <input type="password"
                        className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
                        placeholder='New Password'
                        required
                        autoFocus
                        ref={password}
                    />
                    <input type="password"
                        className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
                        placeholder='Confirm New Password'
                        required
                        ref={confirmPassword}
                    />
                </div>
                
                <button
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] mt-2
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                >
                    {loading ? "Saving..." : "Change Password"}
                </button>
            </form>
        )
    }
    
    return (
        <div className='flex justify-center items-center min-h-screen bg-slate-50 p-4'>
            <Toaster position='top-center' reverseOrder={false} />
            <div className="w-full max-w-5xl flex gap-8 md:gap-12 md:flex-row flex-col justify-around items-center">
                
                {/* Left Side Branding */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4">
                  <h1 className='text-6xl md:text-8xl font-black text-indigo-600 tracking-tight drop-shadow-sm cursor-default'>
                    Social
                  </h1>
                  <p className='text-lg md:text-2xl font-medium text-slate-500 max-w-md leading-relaxed cursor-default'>
                    Get back to connecting with friends.
                  </p>
                </div>
                
                {/* Right Side Form */}
                <div className="w-full sm:max-w-md md:w-1/2 bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-rose-400"></div>
                    
                    <div className="min-h-[250px] flex flex-col justify-center">
                        {!otpSent ? <InputArea /> : !otpConfirm ? <OtpArea /> : <PasswordArea />}
                    </div>
                    
                    <hr className="border-t border-slate-100 my-6" />
                    
                    <div className='flex justify-center'>
                        <Link to={'/login'} className='text-sm font-semibold text-indigo-500 hover:text-indigo-600 hover:underline transition-colors'>
                            Return to Log in
                        </Link>
                    </div>
                    
                    <div className="flex justify-center mt-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Created by Partha
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword