import React, { useEffect, useState } from 'react'
import LeftBar from '../../components/LeftBar'
import Feed from '../../components/Feed'
import CoverProfile from '../../components/CoverProfile'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ProfileRight from '../../components/ProfileRight'

const Profile = () => {
  let { uid } = useParams()
  const [currProfile, setCurrProfile] = useState();
  
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get(`/users/${uid}`);
        setCurrProfile(res.data)
      }
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, [uid])

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-slate-50">
      <LeftBar />
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto w-full">
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
      </div>
    </div>
  )
}

export default Profile