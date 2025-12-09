import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TimetableTable from '../components/TimetableTable'

function UserCard({ id, name, role, email, createdAt, onViewTimetable, onDelete }) {
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary-500/20">
                    {name[0]}
                </div>
                <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {name}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                            {role}
                        </span>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs font-mono">{email}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">


                {onViewTimetable && role !== 'Admin' && (
                    <button
                        onClick={() => onViewTimetable(id)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        View Timetable
                    </button>
                )}

                {onDelete && (
                    <div className="relative group/menu">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden">
                            <button
                                onClick={() => onDelete(id)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Users({ user }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTeacherId, setSelectedTeacherId] = useState(null)
    const [timetableData, setTimetableData] = useState(null)
    const [loadingTimetable, setLoadingTimetable] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [newUser, setNewUser] = useState({ id: '', name: '', email: '', password: '' })
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:8000/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch users:", err)
                setLoading(false)
            })
    }, [])

    const fetchTeacherTimetable = async (teacherId) => {
        setLoadingTimetable(true)
        try {
            const resp = await fetch(`http://localhost:8000/timetable/teacher/${teacherId}`)
            if (!resp.ok) throw new Error("Failed to fetch teacher timetable")
            const data = await resp.json()
            const keys = Object.keys(data || {})
            const section = keys.length ? keys[0] : null
            setTimetableData(data[section])
        } catch (err) {
            console.error(err)
            alert("Failed to load timetable")
        } finally {
            setLoadingTimetable(false)
        }
    }

    const handleViewTimetable = (teacherId) => {
        setSelectedTeacherId(teacherId)
        fetchTeacherTimetable(teacherId)
    }

    const closeTimetable = () => {
        setSelectedTeacherId(null)
        setTimetableData(null)
    }

    const handleDeleteUser = (userId) => {
        setUserToDelete(userId)
    }

    const confirmDeleteForReal = async () => {
        if (!userToDelete) return;

        try {
            const resp = await fetch(`http://localhost:8000/users/${userToDelete}`, {
                method: 'DELETE'
            });
            if (resp.ok) {
                setUsers(users.filter(u => u.id !== userToDelete));
                setUserToDelete(null);
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting user");
        }
    }


    const confirmAddUser = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (resp.ok) {
                const data = await resp.json();
                setUsers([...users, { ...data.user, created_at: "Just now", role: "Teacher" }]);
                setIsAddingUser(false);
                setNewUser({ id: '', name: '', email: '', password: '' });
                alert("User added successfully");
            } else {
                const err = await resp.json();
                alert(err.detail || "Failed to add user");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding user");
        }
    }

    const isAdmin = user?.role === 'Admin';

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Team Management</h1>
                    <p className="text-slate-500 mt-1">Manage access and roles for your organization</p>
                </div>
                <div>
                    <div>
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddingUser(true)}
                                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add User
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    placeholder="Search users by name, email, or employee ID..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm transition-all"
                />
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center text-slate-500 py-10">Loading users...</div>
                ) : (
                    users.map((u) => (
                        <UserCard
                            key={u.id}
                            id={u.id}
                            name={u.name}
                            role={u.role}
                            email={u.email}
                            createdAt={u.created_at}
                            onViewTimetable={(isAdmin || user?.id === u.id) ? handleViewTimetable : null}
                            onDelete={(isAdmin && u.role !== 'Admin') ? handleDeleteUser : null}
                        />
                    ))
                )}
            </div>

            {selectedTeacherId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Teacher Timetable</h3>
                                <p className="text-xs text-slate-500">Viewing schedule for {users.find(u => u.id === selectedTeacherId)?.name}</p>
                            </div>
                            <button onClick={closeTimetable} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 bg-slate-50/50">
                            {loadingTimetable ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                                    <p className="text-slate-500 text-sm font-medium">Loading schedule...</p>
                                </div>
                            ) : (
                                <div className="bg-white m-4 rounded-xl border border-slate-200 shadow-sm overflow-auto">
                                    <TimetableTable data={timetableData} sectionName="Teacher Schedule" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                            <button onClick={closeTimetable} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform scale-100 transition-all">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Delete User?</h3>
                        <p className="text-slate-500 text-center text-sm mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-800">{users.find(u => u.id === userToDelete)?.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteForReal}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors shadow-lg shadow-red-500/30"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Add New User</h3>
                            <button onClick={() => setIsAddingUser(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={confirmAddUser} className="p-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                                        <input
                                            required
                                            type="text"
                                            value={newUser.id}
                                            onChange={e => setNewUser({ ...newUser, id: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            placeholder="TCHR_XXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                        <input
                                            required
                                            type="password"
                                            value={newUser.password}
                                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingUser(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-lg shadow-primary-500/20"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}