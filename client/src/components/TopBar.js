import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import HomeIcon from '@mui/icons-material/Home';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUserStore } from '../zustand';
import Settings from './Settings';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from '../App';

const TopBar = () => {
  const user = useUserStore(s => s.user);
  const [settings, setSettings] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newMsgList, setNewMsgList] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    socket.on("getMsg", data => {
      toast("Received a new Message", {
        style: {
          border: '1px solid #e2e8f0',
          background: '#fff',
          color: '#1e293b',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      });
      setNewMsgList(prev => [...prev, data.senderId]);
    })
  }, [])


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchText.trim() !== "")
        navigate(`/search/users/?q=${searchText}`);
      setSearchText("");
    } catch (err) {
      console.log(err)
    }

  }
  return (
    <div className="h-[100dvh]">
      <div className='sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm flex items-center z-50 justify-between h-16 transition-all duration-300'>
        <Toaster position='top-center' reverseOrder={false} />
        {/* left */}
        <div className="p-3 w-1/4">
          <Link to={'/'} className='flex items-center gap-2 group'>
            <span className='cursor-pointer font-extrabold text-2xl tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600'>
              <span className='text-indigo-500'>So</span>cial
            </span>
            <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
               <HomeIcon fontSize="small" />
            </div>
          </Link>
        </div>
        {/* center */}
        <div className="w-1/2 flex justify-center">
          <form className='w-full max-w-lg' onSubmit={handleSearch}>
            <label className="bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white border border-transparent focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50/50 rounded-full py-1.5 px-4 flex items-center w-full transition-all duration-300 shadow-inner">
              <input
                id='search-inp'
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                type='text'
                placeholder='Search for friends, posts...'
                className='bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none w-full text-sm font-medium' />
              <button className='text-slate-400 hover:text-indigo-500 transition-colors ml-2'>
                <SearchIcon fontSize="small" />
              </button>
            </label>
          </form>
        </div>
        {/* right */}
        <div className="flex gap-5 mr-6 h-8 items-center w-1/4 justify-end">
          <Link
            to={`/profile/${user?._id}`}
            className="flex items-center group">
            <img
              className='rounded-full h-9 w-9 object-cover ring-2 ring-transparent group-hover:ring-indigo-300 shadow-sm transition-all duration-300 transform group-hover:scale-105'
              src={user?.profilePic}
              alt="DP"
            />
          </Link>

          <Link to={'/messenger'} className="relative hidden md:flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300">
            <MessageIcon />
            {
              newMsgList.length > 0 &&
              <span
                className='absolute top-1.5 right-1.5 text-[10px] font-bold bg-rose-500 text-white rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white shadow-sm animate-bounce'>
                {newMsgList.length}
              </span>
            }
          </Link>
          <div className='relative z-50 flex items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300'>
            {
              settings ? (
                <CloseIcon
                  onClick={() => setSettings(!settings)}
                  className='cursor-pointer'
                />
              ) : (
                <MenuIcon
                  onClick={() => setSettings(!settings)}
                  className='cursor-pointer hidden' // Keeping original hidden class if it was there
                />
              )
            }
            {
              settings &&
              <div className="absolute top-12 right-0 z-50">
                <Settings socket={socket} setSettings={setSettings} />
              </div>
            }
          </div>
        </div>
      </div>
      <div className="h-[calc(100dvh-4rem)] bg-slate-50/50">
        <Outlet />
      </div>
    </div>
  )
}

export default TopBar