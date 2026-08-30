import { useEffect, useState } from "react";
// import Ads from "./Ads";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import WcIcon from '@mui/icons-material/Wc';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProfileRight = ({ currProfile }) => {
    const { uid } = useParams();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        try {
            const fetchFriend = async () => {
                const res = await axios.get(`/users/${uid}/followers`);
                setFollowers(res.data);
            }
            fetchFriend();
        } catch (err) {
            console.log(err);
        }
    }, [uid])
    
    const Mutuals = ({ f }) => {
        return (
            <Link to={`/profile/${f?._id}`}
                className='flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-slate-50 transition-colors w-[30%] min-w-[80px]'>
                <img
                    className='w-14 h-14 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shadow-sm'
                    src={f?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                    alt="" />
                <span className="text-xs font-medium text-slate-600 truncate w-full text-center group-hover:text-indigo-600 transition-colors">{f?.username || "Loading..."}</span>
            </Link>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md">
                <div className="mb-6">
                    <h1 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                        <span className="h-4 w-1 bg-indigo-500 rounded-full"></span>
                        About
                    </h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><LocationCityIcon fontSize="small"/></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">Lives in</span>
                                <span className='font-semibold text-slate-700'>{currProfile?.city || "Not specified"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><HomeIcon fontSize="small"/></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">From</span>
                                <span className='font-semibold text-slate-700'>{currProfile?.from || "Not specified"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><WcIcon fontSize="small"/></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">Gender</span>
                                <span className='font-semibold text-slate-700'>{currProfile?.gender === 1 ? "Male" : currProfile?.gender === 2 ? "Female" : "Not specified"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="p-2 bg-rose-50 rounded-lg text-rose-400"><FavoriteIcon fontSize="small"/></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">Relationship</span>
                                <span className='font-semibold text-slate-700'>{currProfile?.relationship === 1 ? "Single" : currProfile?.relationship === 2 ? "Taken" : "Hidden"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr className="border-t border-slate-100 my-6" />
                
                <div className="">
                    <h1 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2'>
                        <span className="h-4 w-1 bg-emerald-500 rounded-full"></span>
                        Followers <span className="ml-auto bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">{followers?.length || 0}</span>
                    </h1>
                    
                    {followers?.length === 0 ? (
                        <div className="text-center py-4 text-sm text-slate-400 italic bg-slate-50 rounded-xl">
                            No followers yet.
                        </div>
                    ) : (
                        <div className='flex flex-wrap gap-x-2 gap-y-4 justify-center'>
                            {
                                followers?.map(f => (
                                    <Mutuals key={f?._id} f={f} />
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-2">
                {/* <Ads /> */}
            </div>
        </div>
    )
}

export default ProfileRight;