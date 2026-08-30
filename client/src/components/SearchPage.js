import React, { useEffect, useState } from 'react'
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../zustand';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const user = useUserStore(s => s.user);
  const token = useUserStore(s => s.token);
  const [searchParams] = useSearchParams();
  let searchText = searchParams.get('q');

  useEffect(() => {
    const searchUsers = async () => {
      try {
        const res = await axios.get(`/users/search?q=${searchText}`)
        const userList = res.data.filter(u => u._id !== user._id)
        setList(userList);
      } catch (error) {
        console.error(error);
        setList([]);
      }
    }
    if (searchText?.trim() !== "") {
      searchUsers();
    } else {
      setList([]);
    }
  }, [searchText, user._id])

  const handleMsg = async ({ uid }) => {
    try {
      const res = await axios.post(`/conv`, {
        senderId: user._id,
        receiverId: uid
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      navigate(`/messenger/${res.data[0]._id}`);
    } catch (err) {
      console.log(err)
    }
  }

  const handleCopy = async ({ uid }) => {
    try {
        await navigator.clipboard.writeText(`${window.location.origin}/profile/${uid}`)
        toast.success("Profile link copied!", {
            style: { borderRadius: '12px', background: '#fff', color: '#1e293b' }
        })
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div className='flex justify-center w-full p-4 overflow-y-auto h-full'>
      <div className="w-full max-w-3xl">
        
        <div className="flex items-center gap-4 mb-6 px-2 mt-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className='text-sm font-bold text-slate-400 uppercase tracking-widest'>Search Results</span>
            <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {
          !list && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <span className="font-semibold text-slate-600">Searching...</span>
            </div>
          )
        }
        
        {
          list?.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-slate-500 mt-4">
                <span className="text-4xl mb-3">🔍</span>
                <span className="font-semibold text-slate-600 text-lg">No Users Found</span>
                <span className="text-sm mt-1">We couldn't find anyone matching "{searchText}".</span>
            </div>
          )
        }
        
        {list && list.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map(i => (
              <div key={i._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
                
                <Link to={`/profile/${i._id}`} className="flex items-center gap-3">
                    <img
                        className='h-14 w-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all'
                        src={i.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"} 
                        alt="" 
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                            {i.username}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            {i.followers?.length || 0} Followers
                        </span>
                    </div>
                </Link>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleCopy({ uid: i._id })}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="Share Profile"
                    >
                        <ShareIcon fontSize="small" />
                    </button>
                    <button
                        onClick={() => { handleMsg({ uid: i._id }) }}
                        className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                        title="Message User"
                    >
                        <ChatIcon fontSize="small" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage