import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function TopBar({ user, onLogout, siteName, onMenuClick }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" onClick={onMenuClick} aria-label="Open menu">
                        {/* hamburger */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>

                    <div className="flex items-center gap-2 md:hidden">
                        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">{siteName}</div>
                    </div>

                    {/* Breadcrumbs or Page Title could go here */}
                    <div className="hidden md:block text-sm text-slate-500 font-medium">

                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 pl-2 focus:outline-none group"
                        >
                            {user && (
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">{user.name}</span>
                                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{user.role}</span>
                                </div>
                            )}

                            <div className="relative">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                                    <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.role}</p>
                                </div>

                                <div className="px-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Your Profile
                                    </Link>
                                </div>

                                <div className="border-t border-slate-100 my-2"></div>

                                <div className="px-2">
                                    <button
                                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}