import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import { useUserStore } from '../zustand';
import Close from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

const Share = ({ setPosts, posts }) => {
    const currUser = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);
    const [postDesc, setPostDesc] = useState("");
    const [postImg, setPostImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [sharing, setSharing] = useState(false);


    const handleShare = async (e) => {
        e.preventDefault();
        setSharing(true);
        try {
            if (!sharing && (postImg !== null || postDesc.trim() !== "")) {
                const formData = new FormData();
                formData.append("userId", currUser._id);
                formData.append("image", postImg);

                const res = await axios.post(`/posts`, {
                    userId: currUser?._id,
                    desc: postDesc,
                }, { headers: { "Authorization": `Bearer ${token}` } });
                
                if (postImg) {
                    const res2 = await axios.put(`/posts/${res.data._id}/upload`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setPosts([res2.data, ...posts]);
                } else {
                    setPosts([res.data, ...posts]);
                }
                
                if(document.getElementById("text-area")) document.getElementById("text-area").value = "";
                if(document.getElementById("file-inp")) document.getElementById("file-inp").value = null;
                setPostDesc("");
                setPostImg(null);
                setPreviewImg(null);
                toast.success("Posted successfully", {
                    style: {
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        color: '#1e293b',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                });
            }
        } catch (err) {
            console.log(err);
        }
        setSharing(false);
    }

    const base64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }
    const handleImgChange = async (e) => {
        if(e.target.files && e.target.files[0]) {
            const cnvImg = await base64(e.target.files[0]);
            setPreviewImg(cnvImg);
            setPostImg(e.target.files[0]);
        }
    }
    const handleClose = () => {
        setPostImg(null);
        setPreviewImg(null);
        if(document.getElementById("file-inp")) document.getElementById("file-inp").value = null;
    }
    
    return (
        <form className='bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 transition-all duration-300 hover:shadow-md' onSubmit={handleShare}>
            <div className="flex gap-4">
                <img
                    className='h-11 w-11 rounded-full object-cover ring-2 ring-slate-50'
                    src={currUser?.profilePic || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"}
                    alt="" />
                <textarea
                    id="text-area"
                    onChange={(e) => setPostDesc(e.target.value)}
                    className='p-3 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl w-full min-h-[60px] max-h-40 focus:outline-none focus:ring-2 ring-indigo-100 transition-all text-slate-700 placeholder-slate-400 resize-y'
                    placeholder="What's on your mind?"
                />
            </div>
            
            {
                previewImg &&
                <div className="w-full mt-4 rounded-xl relative overflow-hidden bg-slate-50 border border-slate-100 p-2">
                    <img
                        className='w-full max-h-[400px] object-contain rounded-lg'
                        src={previewImg || ""} alt="" />
                    <button
                        type="button"
                        onClick={handleClose}
                        className='absolute right-4 top-4 bg-white/80 backdrop-blur text-slate-700 rounded-full p-1.5 hover:bg-rose-50 hover:text-rose-500 shadow-sm transition-all'>
                        <Close fontSize="small" />
                    </button>
                </div>
            }
            
            <hr className='border-t border-slate-100 my-4' />
            
            <div className="flex justify-between items-center">
                <div className="flex gap-4 flex-wrap">
                    <label htmlFor='file-inp' className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 font-medium transition-colors group">
                        <span className="p-1.5 bg-indigo-100 text-indigo-500 rounded-md group-hover:bg-indigo-200 transition-colors"><AddPhotoAlternateIcon fontSize="small"/></span>
                        <span>Photo</span>
                        <input
                            onChange={(e) => handleImgChange(e)}
                            type="file"
                            className="hidden"
                            id="file-inp"
                            accept='image/*' />
                    </label>
                </div>
                <button
                    disabled={sharing || (!postImg && postDesc.trim() === "")}
                    className={`rounded-xl px-6 py-2.5 font-semibold transition-all transform active:scale-95 shadow-sm
                    ${(sharing || (!postImg && postDesc.trim() === "")) 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md"}`}>
                    {sharing ? "Sharing..." : "Post"}
                </button>
            </div>
        </form>
    )
}

export default Share