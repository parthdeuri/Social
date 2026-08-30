import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
        <div className="relative flex justify-center items-center h-16 w-16">
            <div className="absolute animate-ping h-full w-full rounded-full bg-indigo-200 opacity-50"></div>
            <div className="relative flex justify-center items-center h-12 w-12 rounded-full bg-white shadow-md border border-indigo-50">
                <div className="h-6 w-6 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        </div>
        <span className="font-medium text-slate-500 animate-pulse tracking-wide">Loading...</span>
    </div>
  )
}

export default Loading