import React from 'react'

export default function Substitutes() {
    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Substitute & Leave</h1>
                <p className="text-slate-500 mt-1">Manage substitute teachers and leave requests</p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm p-12">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
                    <p className="text-slate-500 mb-8">We're working hard to bring you advanced substitution management features. Stay tuned for updates!</p>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">✓</div>
                            <span className="text-sm font-medium text-slate-700">Automated substitute suggestions</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">✓</div>
                            <span className="text-sm font-medium text-slate-700">Leave request approval workflow</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">✓</div>
                            <span className="text-sm font-medium text-slate-700">Real-time notifications</span>
                        </div>
                    </div>

                    <button className="mt-8 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                        Notify Me When Ready
                    </button>
                </div>
            </div>
        </div>
    )
}