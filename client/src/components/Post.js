import React, { useEffect, useRef, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { format } from 'timeago.js';
import { useUserStore } from '../zustand';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ReportIcon from '@mui/icons-material/Report';
import toast from 'react-hot-toast';

const Post = ({ post, setPosts, cmntL }) => {
    const user = useUserStore(state => state.user);
    const token = useUserStore(state => state.token);
    const [postOwner, setPostOwner] = useState({});
    const [likes, setLikes] = useState(post?.likes?.length);
    const [moreOpt, setMoreOpt] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const [likeStatus, setLikeStatus] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const descEdit = useRef();
    
    if (!cmntL && cmntL !== 0) {
        cmntL = post.comments?.length || 0;
    }
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users/${post.userId}`);
                setPostOwner(res.data)
            } catch(e) {}
        }
        if(post.userId) fetchUser();
        
        if (post.likes?.includes(user?._id)) {
            setLikeStatus(true)
        }
    }, [post, user])


    const handleLike = async () => {
        try {
            const res = await axios.put(`/posts/${post._id}/like`,
                { userId: user._id },
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            res.data === "liked successfully" ? setLikes(p => p + 1) : setLikes(p => p - 1);
            setLikeStatus(!likeStatus);
        } catch (err) {
            console.log(err);
        }
    }
    const deletePost = async () => {
        try {
            setDeleting(true);
            if (postOwner._id === user._id) {
                const res = await axios.put(`/posts/${post._id}/delete`,
                    { userId: user._id },
                    { headers: { "Authorization": `Bearer ${token}` } }
                )
                toast.success(res.data);
                if (setPosts) {
                    setPosts(p => p.filter(u => u._id !== post._id));
                } else {
                    navigate('/')
                }
            } else {
                toast.error("You can't delete someone else's post")
            }
        } catch (err) {
            console.log(err);
            if (err?.response?.data)
                if (err.response.data.name)
                    toast.error(err.response.data.name);
                else
                    toast.error(err.response.data);
        }
        setDeleting(false);
    }
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`)
            toast.success("Link copied to clipboard!");
            setMoreOpt(false);
        } catch (err) {
            console.log(err)
        }
    }
    const handleEdit = () => {
        setEditing(prev => !prev);
        setMoreOpt(prev => !prev)
    }
    const handleSaveEdit = async () => {
        setLoading(true);
        const newDesc = descEdit.current.value;
        try {
            if (newDesc !== document.getElementById(`post-desc-${post._id}`).innerText) {

                const res = await axios.put(`/posts/${post._id}`,
                    { desc: newDesc, edited: true }, { headers: { "Authorization": `Bearer ${token}` } })
                
                post.edited = true;
                toast.success(res.data)
                document.getElementById(`post-desc-${post._id}`).innerText = newDesc;
            }
        } catch (err) {
            toast.error(err.response?.data || "Error");
        }
        setEditing(false);
        setLoading(false);
    }
    
    const OptionsList = () => {
        return (
            <div className="absolute top-8 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-10 animate-fade-in text-sm font-medium text-slate-700">
                {
                    user._id === postOwner._id &&
                    <>
                        <button onClick={handleEdit} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                            <EditIcon fontSize="small" className="text-slate-400" />
                            <span>{editing ? "Cancel edit" : "Edit Post"}</span>
                        </button>
                        <button
                            onClick={deletePost}
                            disabled={deleting}
                            className={`w-full text-left px-3 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg flex items-center gap-2 transition-colors ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <DeleteForeverIcon fontSize="small" className={deleting ? "text-slate-400" : "text-rose-400"} />
                            <span>{deleting ? "Deleting..." : "Delete"}</span>
                        </button>
                    </>
                }
                <button
                    onClick={handleCopy}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <ShareIcon fontSize="small" className="text-slate-400" />
                    <span>Copy Link</span>
                </button>
                {
                    user._id !== postOwner._id &&
                    <button className="w-full text-left px-3 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg flex items-center gap-2 transition-colors">
                        <ReportIcon fontSize="small" className="text-rose-400" />
                        <span>Report</span>
                    </button>
                }
            </div>
        )
    }
    
    return (
        <div className='bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mt-6 transition-all duration-300 hover:shadow-md'>
            <div className="">
                {/* top */}
                <div className="flex justify-between items-center mb-3">
                    <Link to={`/profile/${postOwner._id}`} className="flex items-center gap-3 cursor-pointer group">
                        <img
                            className='h-10 w-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all'
                            src={postOwner.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                            alt="" />
                        <div className='flex flex-col'>
                            <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{postOwner.username || "Loading..."}</span>
                            <span className='text-[11px] font-medium text-slate-400 cursor-default flex items-center gap-1'>
                                {format(post.createdAt)}
                                {post?.edited && <span className="italic text-slate-300 px-1">(edited)</span>}
                            </span>
                        </div>
                    </Link>
                    <div className="relative">
                        <button 
                            onClick={() => setMoreOpt(!moreOpt)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {moreOpt ? <CloseIcon fontSize="small" /> : <MoreHorizIcon />}
                        </button>
                        {moreOpt && <OptionsList />}
                    </div>
                </div>
                
                {/* content */}
                <div className="py-2 mb-2">
                    <div id={`post-desc-${post._id}`} onClick={() => { navigate(`/post/${post._id}`) }} className={`px-1 text-slate-700 leading-relaxed whitespace-pre-wrap ${!editing ? "block" : "hidden"}`}>
                        {post.desc}
                    </div>
                    
                    {/* editing mode */}
                    <div className={`${editing ? "flex" : "hidden"} flex-col mt-2 gap-3`}>
                        <textarea
                            id={`inp-desc-${post._id}`}
                            defaultValue={post.desc}
                            placeholder='Edit your text here'
                            className='w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ring-indigo-200 text-slate-700 resize-y min-h-[80px]'
                            ref={descEdit}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditing(false)}
                                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                    
                    {/* image */}
                    {post.image && (
                        <div className="mt-4 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 cursor-pointer" onClick={() => { navigate(`/post/${post._id}`) }}>
                           <img
                               className='w-full max-h-[500px] object-contain hover:scale-[1.01] transition-transform duration-500'
                               src={post.image}
                               alt="Post Content" />
                        </div>
                    )}
                </div>
                
                <hr className="border-t border-slate-100 my-3" />
                
                {/* likes and comments actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleLike}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-medium text-sm group ${likeStatus ? "text-rose-500 bg-rose-50 hover:bg-rose-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
                        <div className="transform group-active:scale-75 transition-transform">
                            {!likeStatus ? <FavoriteBorderIcon fontSize="small" className="text-slate-400 group-hover:text-rose-400 transition-colors" /> : <FavoriteIcon fontSize="small" />}
                        </div>
                        <span>{likes || 0}</span>
                    </button>
                    <button 
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-medium text-sm text-slate-500 hover:bg-slate-50 hover:text-indigo-600 group">
                        <ChatBubbleOutlineIcon fontSize="small" className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span>{cmntL}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Post