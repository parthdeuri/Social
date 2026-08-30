import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../../zustand';
import toast, { Toaster } from 'react-hot-toast';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useUserStore(s => s.setUser);
  const setToken = useUserStore(s => s.setToken);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`/auth/login`, { email, password })
      setUser(res.data.userData);
      setToken(res.data.token);
    } catch (err) {
      console.log(err)
      if (err?.response?.data)
        toast.error(err.response.data, {
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#1e293b',
          }
        });
    }
    setLoading(false);
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
            Connect with friends and the world around you on Social.
          </p>
        </div>

        {/* Right Side Form */}
        <div className="w-full sm:max-w-md md:w-1/2 bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400"></div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input type="email"
                onChange={e => setEmail(e.target.value)}
                className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
                placeholder='Email address'
                required
                autoFocus
              />
            </div>
            <div>
              <input type="password"
                onChange={e => setPassword(e.target.value)}
                className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 placeholder:text-slate-400 font-medium'
                placeholder='Password'
                required
              />
            </div>
            
            <button
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-md transition-all active:scale-[0.98] mt-2
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}>
              {loading ? "Verifying..." : "Log In"}
            </button>
          </form>
          
          <div className='flex justify-center mt-6 mb-6'>
            <Link to={'/forgot-password'} className='text-sm font-medium text-indigo-500 hover:text-indigo-600 hover:underline transition-colors'>
              Forgotten Password?
            </Link>
          </div>
          
          <hr className="border-t border-slate-100 mb-6" />
          
          <div className="flex justify-center">
            <Link to={'/register'} className='inline-block px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98]'>
              Create New Account
            </Link>
          </div>
          
          <div className="flex justify-center mt-8 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Created by Partha
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login