import React, { useEffect, useState } from 'react'
import LeftBar from '../../components/LeftBar'
import Feed from '../../components/Feed'
import CoverProfile from '../../components/CoverProfile'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ProfileRight from '../../components/ProfileRight'
import SearchOffIcon from '@mui/icons-material/SearchOff';

const Profile = () => {
  let { uid } = useParams()
  const [currProfile, setCurrProfile] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setUserNotFound(false);
      try {
        const res = await axios.get(`/users/${uid}`);
        if (!res.data) {
          setUserNotFound(true);
        } else {
          setCurrProfile(res.data)
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setUserNotFound(true);
        }
        console.log(err);
      }
      setLoading(false);
    }
    fetchUser();
  }, [uid])

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-slate-50">
      <LeftBar />
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative">
        {loading ? (
           <div className="h-full w-full flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
           </div>
        ) : userNotFound ? (
           <div className="h-full w-full flex flex-col items-center justify-center p-6 animate-fade-in">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center max-w-md w-full text-center">
               <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                 <SearchOffIcon sx={{ fontSize: 40 }} />
               </div>
               <h1 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h1>
               <p className="text-slate-500 mb-8">
                 This account doesn't exist. The user may have deleted their account, or the link might be broken.
               </p>
               <Link to="/" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95">
                 Go Back Home
               </Link>
             </div>
           </div>
        ) : (
          <div className="max-w-6xl mx-auto w-full animate-fade-in">
              <CoverProfile uid={uid} userProfile={currProfile} />
              <div className="flex flex-col md:flex-row px-4 md:px-8 pb-10 gap-6 mt-6 md:mt-12 relative z-10">
                <div className="w-full md:w-3/5 lg:w-2/3">
                    <Feed profile />
                </div>
                <div className="w-full md:w-2/5 lg:w-1/3">
                    <ProfileRight currProfile={currProfile} />
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile