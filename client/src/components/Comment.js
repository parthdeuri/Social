import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReportIcon from '@mui/icons-material/Report';
import { useUserStore } from "../zustand";
import toast from "react-hot-toast";

const Comment = ({ c, p, setAllComments }) => {
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const [commenter, setCommenter] = useState();
    const [mrOpt, setMrOpt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const cmtEdit = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${c.userId}`);
            setCommenter(res.data)
        }
        fetchUser();
    }, [c])

    const handleDelete = async (cmnt) => {
        setLoading(true);
        try {
            const res = await axios.put(`/posts/${p?._id}/comment/${cmnt?._id}/delete`, {
                userId: user._id
            }, { headers: { "Authorization": `Bearer ${token}` } })
            toast.success(res.data);
            setAllComments(prev => prev.filter(c => c?._id !== cmnt?._id));
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }
    
    const handleEdit = () => {
        setEditing(prev => !prev);
        setMrOpt(false);
    }
    
    const handleSaveEdit = async () => {
        const newCmnt = cmtEdit.current.value;
        setLoading(true);
        try {
            if (newCmnt !== document.getElementById(`comment-text-${c._id}`).innerText) {
                const res = await axios.put(`/posts/${p?._id}/comment/${c?._id}`,
                    { userId: user._id, comment: newCmnt },
                    { headers: { "Authorization": `Bearer ${token}` } })
                c.updatedAt = Date.now();
                toast.success(res.data);
                document.getElementById(`comment-text-${c._id}`).innerText = newCmnt;
            }
        } catch (err) {
            toast.error(err.response?.data || "Error updating comment");
        }
        setLoading(false);
        setEditing(false);
    }

    const MoreOpt = ({ cmnt, cmtr }) => {
        return (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-10 animate-fade-in text-sm font-medium text-slate-700">
                {cmtr?._id === user?._id && (
                    <button 
                        onClick={handleEdit}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                        <EditIcon fontSize="small" className="text-slate-400" />
                        <span>Edit Comment</span>
                    </button>
                )}
                
                {(user?._id === p.userId || user?._id === cmtr?._id) && (
                    <button 
                        onClick={() => handleDelete(cmnt)}
                        disabled={loading}
                        className={`w-full text-left px-3 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg flex items-center gap-2 transition-colors ${loading ? 'opacity-50' : ''}`}>
                        <DeleteForeverIcon fontSize="small" className="text-rose-400" />
                        <span>{loading ? "Deleting..." : "Delete Comment"}</span>
                    </button>
                )}
                
                {cmtr?._id !== user?._id && (
                    <button className="w-full text-left px-3 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg flex items-center gap-2 transition-colors">
                        <ReportIcon fontSize="small" className="text-rose-400" />
                        <span>Report</span>
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="flex gap-3 mb-4 group">
            <Link to={`/profile/${commenter?._id}`} className="shrink-0">
                <img
                    className='h-9 w-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all'
                    src={commenter?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"} 
                    alt="" 
                />
            </Link>
            
            <div className="flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-2.5 flex-1 relative">
                        <div className="flex items-center gap-2 mb-1">
                            <Link to={`/profile/${commenter?._id}`} className='font-bold text-sm text-slate-800 hover:text-indigo-600 transition-colors'>
                                {commenter?.username || "Loading..."}
                            </Link>
                        </div>
                        
                        {!editing ? (
                            <div id={`comment-text-${c._id}`} className="text-[14px] text-slate-700 whitespace-pre-wrap break-words">
                                {c.comment}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                <textarea
                                    id={`inp-desc-${c._id}`}
                                    defaultValue={c.comment}
                                    placeholder='Edit your comment...'
                                    className='w-full p-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ring-indigo-100 text-slate-700 resize-y min-h-[60px]'
                                    ref={cmtEdit}
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={loading}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-1">
                            <span className='text-[11px] font-medium text-slate-400'>{format(c?.createdAt)}</span>
                            {c.createdAt !== c.updatedAt && <span className='text-[11px] text-slate-300 italic'>(edited)</span>}
                        </div>
                    </div>
                    
                    <div className="relative shrink-0 pt-1">
                        <button
                            onClick={() => setMrOpt(!mrOpt)}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            {mrOpt ? <CloseIcon fontSize="small" /> : <MoreHorizIcon fontSize="small" />}
                        </button>
                        {mrOpt && <MoreOpt cmnt={c} cmtr={commenter} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment;