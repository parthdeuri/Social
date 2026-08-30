import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../zustand'
import VerifyPassword from '../../components/VerifyPassword';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const EditProfile = () => {
  const user = useUserStore(s => s.user);
  const [dp, setDp] = useState("");
  const [dpPreview, setDpPreview] = useState("");
  const [cover, setCover] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const newUser = user;
  const [newUserCopy, setNewUserCopy] = useState();
  const [save, setSave] = useState(false);
  const [tempImg, setTempImg] = useState();


  useEffect(() => {
    setTempImg({ dp: user.profilePic, cover: user.coverPic });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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


  const handleDPChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const cnvImg = await base64(e.target.files[0]);
      setDpPreview(cnvImg);
      setDp(e.target.files[0]);
    }
  }
  const handleCoverChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const cnvImg = await base64(e.target.files[0]);
      setCoverPreview(cnvImg);
      setCover(e.target.files[0]);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    newUser.profilePic = dp;
    newUser.coverPic = cover;
    if (newUser.profilePic === "") {
      setDpPreview(user.profilePic)
      delete newUser.profilePic;
    }
    if (newUser.coverPic === "") {
      setCoverPreview(user.coverPic)
      delete newUser.coverPic;
    }
    setNewUserCopy(newUser);
    setSave(true);
  }
  
  return (
    <div className='h-full overflow-y-auto bg-slate-50 relative'>
      {save && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <VerifyPassword newUser={newUserCopy} setSave={setSave} />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Header & Cover Edit */}
          <div className="relative w-full h-64 md:h-80 bg-slate-100 group">
            <img 
                src={coverPreview || user.coverPic || tempImg?.cover || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80"} 
                className="w-full h-full object-cover"
                alt="Cover Preview" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <label className="cursor-pointer bg-white/90 backdrop-blur text-slate-800 px-4 py-2 rounded-xl font-medium shadow-sm hover:scale-105 transition-all flex items-center gap-2">
                    <AddAPhotoIcon fontSize="small"/> Change Cover
                    <input className='hidden' id='cp-inp' type='file' accept='image/*' onChange={handleCoverChange} />
                </label>
            </div>
          </div>

          {/* Avatar Edit & Main Form Area */}
          <div className="px-6 md:px-12 pb-12">
            
            {/* Avatar positioning */}
            <div className="relative flex justify-between items-end -mt-16 mb-8">
                <div className="relative group rounded-full">
                    <img
                        className='h-32 w-32 object-cover rounded-full border-4 border-white shadow-md bg-white'
                        src={dpPreview || user.profilePic || tempImg?.dp || "https://i.pinimg.com/236x/9a/e8/fc/9ae8fc22197c56c5e5b0c2c22b05186e.jpg"} 
                        alt="Profile Preview"
                    />
                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <AddAPhotoIcon className="text-white"/>
                        <input className='hidden' id='dp-inp' type='file' accept='image/*' onChange={handleDPChange} />
                    </label>
                </div>
                
                <button
                    type="submit"
                    className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 mb-4'
                >
                    Save Changes
                </button>
            </div>
            
            <hr className="border-t border-slate-100 mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
                        <input
                            type="text"
                            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium'
                            onChange={(e) => { newUser.username = e.target.value }}
                            defaultValue={user.username}
                            placeholder='Username'
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                        <input
                            type="text"
                            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium'
                            onChange={(e) => { newUser.fullname = e.target.value }}
                            defaultValue={user.fullname}
                            placeholder='Full Name'
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium'
                            onChange={(e) => { newUser.email = e.target.value }}
                            defaultValue={user.email}
                            placeholder='Email Address'
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                        <textarea
                            className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium resize-y min-h-[100px]'
                            onChange={(e) => { newUser.desc = e.target.value }}
                            defaultValue={user.desc}
                            placeholder='Write something about yourself...'
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium'
                                onChange={(e) => { newUser.city = e.target.value }}
                                defaultValue={user.city}
                                placeholder='Current City'
                            />
                            <input
                                type="text"
                                className='w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-3 outline-none focus:ring-4 ring-indigo-50 transition-all text-slate-700 font-medium'
                                onChange={(e) => { newUser.from = e.target.value }}
                                defaultValue={user.from}
                                placeholder='Hometown'
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { id: 'male', value: 1, label: 'Male' },
                                { id: 'female', value: 2, label: 'Female' },
                                { id: 'other-g', value: 3, label: 'Other' },
                            ].map(g => (
                                <label key={g.id} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender-g"
                                        value={g.value}
                                        id={g.id}
                                        defaultChecked={newUser.gender === g.value}
                                        onChange={(e) => { newUser.gender = parseInt(e.target.value) }}
                                        className="peer sr-only"
                                    />
                                    <div className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-indigo-50 peer-checked:border-indigo-200 peer-checked:text-indigo-700 transition-colors">
                                        {g.label}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Relationship</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { id: 'single', value: 1, label: 'Single' },
                                { id: 'taken', value: 2, label: 'Taken' },
                                { id: 'other-r', value: 3, label: 'Hidden' },
                            ].map(r => (
                                <label key={r.id} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="relationship"
                                        value={r.value}
                                        id={r.id}
                                        defaultChecked={newUser.relationship === r.value}
                                        onChange={(e) => { newUser.relationship = parseInt(e.target.value) }}
                                        className="peer sr-only"
                                    />
                                    <div className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-rose-50 peer-checked:border-rose-200 peer-checked:text-rose-600 transition-colors">
                                        {r.label}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </form>
      </div>
    </div >
  )
}

export default EditProfile