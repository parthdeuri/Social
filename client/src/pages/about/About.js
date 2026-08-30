import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-50 p-4 relative overflow-hidden'>
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-10 md:p-16 flex flex-col items-center text-center relative z-10 text-slate-800">
        
        <div className="mb-8">
            <h1 className='text-6xl md:text-8xl font-black text-indigo-600 tracking-tight drop-shadow-sm cursor-default mb-6'>
              Social
            </h1>
            <p className='text-lg md:text-xl font-medium text-slate-500 leading-relaxed cursor-default'>
              A modern social media platform designed for connection.
            </p>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 w-full mb-8">
            <p className="text-slate-600 leading-relaxed mb-4">
                Developed by <span className="font-semibold text-slate-700">Parthapratim Deuri</span>
            </p>
            <Link 
                to='https://github.com/Partha-deuri' 
                target="_blank"
                rel="noopener noreferrer"
                className='inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm'
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                @Partha-deuri
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Educational Purpose Only
            </p>
        </div>

        <Link 
            to={'/'} 
            className='px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95' 
        >
            Return Home
        </Link>
      </div>
    </div>
  )
}

export default About