import React, { useEffect, useState } from 'react';

const WakeUp = ({ wakeup }) => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (seconds > 0) {
            const interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            wakeup();
        }
    }, [seconds, wakeup]);

    const progress = ((60 - seconds) / 60) * 100;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-rose-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-10 flex flex-col items-center text-center relative z-10 transform transition-all duration-500 hover:scale-[1.01]">
                
                {/* Glowing Spinner Container */}
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <svg className="relative w-16 h-16 text-slate-100 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Waking up the server</h1>
                
                <div className="text-slate-500 font-medium mb-8">
                    {seconds > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                            <span>Please wait</span>
                            <span className="inline-flex min-w-[2rem] justify-center font-mono font-bold bg-indigo-50 text-indigo-600 py-0.5 px-2 rounded-lg">{seconds}</span>
                            <span>seconds...</span>
                        </div>
                    ) : (
                        <span className="text-indigo-600 animate-pulse font-semibold">Connecting... Please reload if stuck.</span>
                    )}
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-indigo-600 transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Since the server is hosted on a free tier, it spins down during periods of inactivity. This initial request wakes it up and may take around <strong className="text-indigo-600 font-semibold">50 seconds</strong> to complete.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default WakeUp;