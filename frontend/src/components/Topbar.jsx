import React from 'react'


export default function TopBar({ loggedIn, setLoggedIn, siteName, onMenuClick }) {
return (
<header className="bg-white border-b">
<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
<div className="flex items-center gap-3">
<button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={onMenuClick} aria-label="Open menu">
{/* hamburger */}
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
</button>


<div className="flex items-center gap-2">
<div className="text-2xl font-bold text-indigo-600">{siteName}</div>
</div>
</div>


<div className="flex items-center gap-2">
<div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 bg-white border rounded px-3 py-1">
<img src={`https://ui-avatars.com/api/?name=V&background=7c3aed&color=fff`} alt="avatar" className="w-6 h-6 rounded-full" />
<span>Virat</span>
<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
</div>


<button onClick={() => setLoggedIn(!loggedIn)} className="px-3 py-1 border rounded hidden sm:inline">{loggedIn ? 'Logout' : 'Login'}</button>
</div>
</div>
</header>
)
}