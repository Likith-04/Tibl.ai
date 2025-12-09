import React, { useState, useEffect } from 'react';

export default function Profile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                // Update local storage
                const updatedUser = { ...user, ...result.user };
                localStorage.setItem('tibl_user', JSON.stringify(updatedUser));

                setIsEditing(false);
                // Reload to reflect changes globally
                window.location.reload();
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${formData.name || user.name}&background=3b82f6&color=fff`}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                        />

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm transition-colors shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-2xl font-bold text-slate-800 border-b border-slate-300 focus:border-primary-500 outline-none bg-transparent w-full max-w-md"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                        )}
                        <p className="text-slate-500 font-medium">{user.role}</p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="text-slate-700 font-medium border-b border-slate-300 focus:border-primary-500 outline-none bg-transparent w-full"
                                />
                            ) : (
                                <div className="text-slate-700 font-medium">{user.email}</div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">User ID</label>
                            <div className="text-slate-700 font-medium">{user.id}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
