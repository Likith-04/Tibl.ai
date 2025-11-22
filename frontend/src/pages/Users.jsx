import React from 'react'


function UserCard({ name, role, email }) {
return (
<div className="bg-white rounded p-4 shadow flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">{name[0]}</div>
<div>
<div className="font-semibold">{name} <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded">{role}</span></div>
<div className="text-sm text-gray-500">{email || 'No email added'}</div>
</div>
</div>


<div className="text-sm text-gray-500">Created Sep 13, 2025</div>
</div>
)
}


export default function Users() {
const sample = ['Virat','E','D','C','B','A']
return (
<div>
<div className="flex items-center justify-between">
<h1 className="text-2xl font-bold">Team Management</h1>
<div>
<button className="px-3 py-2 bg-indigo-600 text-white rounded">+ Add User</button>
</div>
</div>


<div className="mt-4">
<input placeholder="Search users by name, email, or employee ID..." className="w-full border rounded px-3 py-2" />
</div>


<div className="mt-4 space-y-3">
{sample.map((s) => <UserCard key={s} name={s} role={s==='Virat' ? 'Owner' : 'Staff Member'} email={s==='Virat' ? 'virat.0465.kohli@gmail.com' : ''} />)}
</div>
</div>
)
}