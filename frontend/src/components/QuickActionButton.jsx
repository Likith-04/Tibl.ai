import React from 'react'


export default function QuickActionButton({ title, color = 'blue', icon, onClick }) {
const colorClasses = {
blue: 'bg-blue-600 hover:bg-blue-700',
orange: 'bg-orange-600 hover:bg-orange-700',
green: 'bg-green-600 hover:bg-green-700',
teal: 'bg-emerald-600 hover:bg-emerald-700'
}


return (
<button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-sm ${colorClasses[color] || colorClasses.blue}`}>
<span className="w-6 h-6 flex items-center justify-center">{icon}</span>
<span className="font-medium">{title}</span>
</button>
)
}