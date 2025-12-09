// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import QuickActionButton from "../components/QuickActionButton";
import { downloadFile } from "../api/timetable";

/**
 * Dashboard with working quick action buttons.
 * - Navigates to internal pages using react-router's useNavigate.
 * - Provides a Download XLSX quick action which calls downloadFile()
 *   with the server-local XLSX path. Your tooling will convert the local
 *   path to a usable HTTP URL (or you can hit /download/dev-xlsx).
 */

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  // local server path for the XLSX (tooling will transform to HTTP URL)
  const LOCAL_XLSX_PATH =
    "/mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx";
  const SUGGESTED_XLSX_FILENAME = "All_Timetables_with_Teachers_fixed_v2.xlsx";

  // navigation handlers - match App.jsx routes
  const goMyTimetables = () => navigate("/dashboard/my-timetables");
  const goSubstitutes = () => navigate("/dashboard/substitutes");
  const goUsers = () => navigate("/users");
  const goResources = () => navigate("/resources");

  const handleDownload = async () => {
    try {
      await downloadFile("All_Timetables_with_Teachers_fixed_v2.xlsx");
    } catch (err) {
      alert("Failed to download file: " + err.message);
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Good evening, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your organization today.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <div className="hidden md:block text-right mr-2">
                <div className="text-sm font-semibold text-slate-700">Academic Year 2025-26</div>
                <div className="text-xs text-slate-500">Semester 1 • Week 12</div>
              </div>
              <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                View Reports
              </button>
            </>
          )}
          {isAdmin && (
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              + New Event
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickActionButton
                title="My Timetables"
                description="View and manage class schedules"
                color="blue"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                onClick={goMyTimetables}
              />
              <QuickActionButton
                title="Substitutes"
                description="Manage leave & replacements"
                color="orange"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                onClick={goSubstitutes}
              />
              {isAdmin && (
                <QuickActionButton
                  title="Manage Users"
                  description="Add or remove staff members"
                  color="purple"
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                  onClick={goUsers}
                />
              )}
              <QuickActionButton
                title="Resources"
                description="Room & lab availability"
                color="emerald"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                onClick={goResources}
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Data Exports
            </h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Master Timetable Export</h3>
                  <p className="text-sm text-slate-500 mt-1">Download the complete schedule for all classes and teachers in Excel format.</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download XLSX
              </button>
            </div>
          </section>
        </div>

        {isAdmin && (
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Overview</h2>
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Total Classes</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">42</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Active Teachers</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">18</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Pending Substitutes</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">3</div>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-800 font-medium">Timetable generated for CSE Dept</p>
                      <p className="text-xs text-slate-500 mt-1">2 hours ago • by Admin</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-800 font-medium">New teacher added: R. Sharma</p>
                      <p className="text-xs text-slate-500 mt-1">5 hours ago • by Admin</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-800 font-medium">Leave request: M. Dhoni (Sick)</p>
                      <p className="text-xs text-slate-500 mt-1">1 day ago • Pending Approval</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors border-t border-slate-50">
                  View All Activity
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
