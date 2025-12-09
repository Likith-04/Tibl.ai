import React from 'react'
import { useNavigate } from 'react-router-dom'
import QuickActionButton from '../components/QuickActionButton'

export default function AdminDashboard({ user }) {
    const navigate = useNavigate()

    const goUsers = () => navigate("/users")
    const goResources = () => navigate("/resources")
    const goMyTimetables = () => navigate("/dashboard/my-timetables")
    const goSubstitutes = () => navigate("/dashboard/substitutes")

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name}. You have full access to manage the organization.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right mr-2">
                        <div className="text-sm font-semibold text-slate-700">Academic Year 2025-26</div>
                        <div className="text-xs text-slate-500">Semester 1 • Week 12</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                            Admin Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <QuickActionButton
                                title="Manage Users"
                                description="Add, remove, or edit staff members"
                                color="purple"
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                                onClick={goUsers}
                            />
                            <QuickActionButton
                                title="Resources"
                                description="Manage rooms and labs"
                                color="emerald"
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                                onClick={goResources}
                            />
                            <QuickActionButton
                                title="All Timetables"
                                description="View master schedule"
                                color="blue"
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                                onClick={goMyTimetables}
                            />
                            <QuickActionButton
                                title="Substitutes"
                                description="Manage leave requests"
                                color="orange"
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                                onClick={goSubstitutes}
                            />
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">System Status</h2>
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-slate-500 font-medium">System Health</div>
                                    <div className="text-green-600 font-bold mt-1">Operational</div>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
