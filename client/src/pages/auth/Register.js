import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../zustand';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


const Register = () => {
  const [email, setEmail] = useState("");
  const [otpId, setOtpId] = useState();
  const emailRef = useRef();
  const otp = useRef();
  const username = useRef();
  const fullname = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const setUser = useUserStore(s => s.setUser);
  const setToken = useUserStore(s => s.setToken);
  const navigate = useNavigate();
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastStyle = {
    style: {
      borderRadius: '12px',
      background: '#fff',
      color: '#1e293b',
    }
  };

  const handleFirst = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setEmail(emailRef.current.value.trim());
      const res = await axios.get(`/auth/email/${emailRef.current.value.trim()}`);
      if (res.data?.msg === "all ok") {
        setOtpId(res.data.otpId);
        setFirst(false);
        setSecond(true);
      } else {
        toast.error(res.data.msg, toastStyle)
      }
    }
    catch (err) {
      toast.error("An error occurred", toastStyle);
    }
    setLoading(false);
  }

  const FirstSignup = () => {
    return (
      <form className="flex flex-col gap-4 animate-fade-in" onSubmit={handleFirst}>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p className="text-slate-500 mb-6 text-sm">Enter your email to get started.</p>
          <input
            type="email"
            ref={emailRef}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
            required
            placeholder='Email address'
            autoFocus
            inputMode='email'
          />
        </div>
        <button
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] mt-2
          ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    )
  }

  const handleSecond = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (otp.current.value.length === 6) {
        const res = await axios.post(`/auth/otp`, {
          otpId,
          otp: otp.current.value,
          email
        })
        if (res.data.msg === "success") {
          setSecond(false);
          setThird(true);
        }
      } else {
        toast.error("OTP must be 6 digits", toastStyle)
      }
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("OTP mismatch", toastStyle);
      } else {
        toast.error("Error verifying OTP", toastStyle)
      }
      setLoading(false);
    }
  }
  
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/auth/email/${email}`);
      if (res.data?.msg === "all ok") {
        setOtpId(res.data.otpId);
        setFirst(false);
        setSecond(true);
        toast.success("OTP resent successfully", toastStyle);
      } else {
        toast.error(res.data.msg, toastStyle)
      }
      setLoading(false);
    } catch (err) {
      toast.error("Error resending OTP", toastStyle)
      setLoading(false);
    }
  }
  
  const handleWrongEmail = () => {
    setEmail("");
    setSecond(false);
    setFirst(true);
  }
  
  const SecondSignup = () => {
    return (
      <form className="flex flex-col gap-4 animate-fade-in" onSubmit={handleSecond}>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Email</h2>
          <p className='text-slate-500 mb-6 text-sm leading-relaxed'>
            We sent a 6-digit code to <span className="font-semibold text-indigo-600">{email}</span>.
          </p>
          
          <input type="number"
            ref={otp}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium tracking-widest text-center text-xl'
            required
            placeholder='------'
            autoFocus
            inputMode='numeric'
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

        <button type='submit'
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] 
          ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}>
          {loading ? "Verifying..." : "Confirm OTP"}
        </button>
      </form>
    )
  }

  const handleThird = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uname = username.current.value
      const fname = fullname.current.value
      const pswrd = password.current.value
      const cnfPswd = confirmPassword.current.value
      if (cnfPswd === pswrd) {
        const res = await axios.get(`/auth/username/${uname.trim()}`);
        if (res.data?.msg === "username exist") {
          const res2 = await axios.post(`/auth/register`, {
            username: uname,
            fullname: fname,
            password: pswrd,
            email,
          })
          setUser(res2.data.userData);
          setToken(res2.data.token)
          navigate('/editprofile');
        } else {
          toast.error("Please choose a different username", toastStyle);
          setTimeout(() => {
            fullname.current.value = fname;
            password.current.value = pswrd;
            confirmPassword.current.value = cnfPswd;
          }, 10)
        }
      } else {
        toast.error("Passwords do not match", toastStyle)
      }
    } catch (err) {
      toast.error("An error occurred during registration", toastStyle);
    }
    setLoading(false);
  }
  
  const ThirdSignup = () => {
    return (
      <form className="flex flex-col gap-4 animate-fade-in" onSubmit={handleThird}>
        <div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">Almost Done!</h2>
           <p className="text-slate-500 mb-6 text-sm">Set up your profile details.</p>
        </div>
        
        <div className="flex flex-col gap-3">
            <input type="text"
            ref={fullname}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
            required
            placeholder='Full Name'
            autoCapitalize='on'
            />
            <input type="text"
            ref={username}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
            autoFocus
            required
            placeholder='Username'
            />
            <input type="password"
            ref={password}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
            required
            placeholder='Password'
            />
            <input type="password"
            ref={confirmPassword}
            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
            required
            placeholder='Confirm Password'
            />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] mt-2
          ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}>
          {loading ? "Creating Account..." : "Sign Up"}
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
            Join the community and share your moments.
          </p>
        </div>
        
        {/* Right Side Form */}
        <div className="w-full sm:max-w-md md:w-1/2 bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
          
          <div className="min-h-[300px] flex flex-col justify-center">
            {first && <FirstSignup />}
            {second && <SecondSignup />}
            {third && <ThirdSignup />}
          </div>
          
          <hr className="border-t border-slate-100 my-6" />
          
          <div className='flex justify-center'>
            <Link to={'/login'} className='text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors'>
              Already have an account? <span className="text-indigo-500 hover:underline">Log in</span>
            </Link>
          </div>
          
          <div className="flex justify-center mt-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Created by Parthapartim Deuri
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register