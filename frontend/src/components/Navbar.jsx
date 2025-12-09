import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'


function NavItem({ to, label }) {
return (
<NavLink
to={to}
className={({ isActive }) =>
`block px-4 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
}
>
{label}
</NavLink>
)
}


export default function Navbar() {
const [collapsed, setCollapsed] = useState(false)


return (
<aside className={`bg-white h-screen shadow sidebar-width ${collapsed ? 'w-16' : ''}`}>
<div className="p-3 flex items-center justify-between">
<div className={`font-semibold ${collapsed ? 'text-xs' : 'text-lg'}`}>Tibl.ai</div>
<button
onClick={() => setCollapsed(s => !s)}
className="p-1 border rounded"
aria-label="Toggle sidebar"
>
{collapsed ? '▶' : '◀'}
</button>
</div>


<nav className="mt-4 px-2">
<div className="mb-3 text-xs text-gray-500 px-4">Dashboard</div>
<NavItem to="/dashboard" label="Overview" />
<NavItem to="/dashboard/my-timetables" label="My Timetables" />
<NavItem to="/dashboard/substitutes" label="Substitutes" />


<div className="mt-6 mb-3 text-xs text-gray-500 px-4">Manage</div>
<NavItem to="/faculty" label="Faculty" />
<NavItem to="/courses" label="Courses" />
</nav>


<div className="mt-auto p-4 text-xs text-gray-500">© {new Date().getFullYear()} Tibl.ai</div>
</aside>
)
}