import React from 'react'

export default function QuickActionButton({ title, color = 'blue', icon, onClick, description }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
        orange: 'from-orange-500 to-orange-600 shadow-orange-500/30',
        green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
        teal: 'from-teal-500 to-teal-600 shadow-teal-500/30',
        purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    }

    const selectedColor = colorClasses[color] || colorClasses.blue

    return (
        <button
            onClick={onClick}
            className={`group relative overflow-hidden flex flex-col items-start gap-3 p-5 rounded-2xl text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${selectedColor}`}
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>

            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
            </div>

            <div className="text-left relative z-10">
                <span className="font-semibold text-lg block">{title}</span>
                {description && <span className="text-xs text-white/80 mt-1 block font-medium">{description}</span>}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
        </button>
    )
}