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

export default function Dashboard() {
  const navigate = useNavigate();

  // local server path for the XLSX (tooling will transform to HTTP URL)
  const LOCAL_XLSX_PATH =
    "/mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx";
  const SUGGESTED_XLSX_FILENAME = "All_Timetables_with_Teachers_fixed_v2.xlsx";

  // navigation handlers - match App.jsx routes
  const goMyTimetables = () => navigate("/dashboard/my-timetables");
  const goSubstitute = () => navigate("/dashboard/substitutes");
  const goManageUsers = () => navigate("/users");
  const goCalendar = () => navigate("/dashboard/calendar"); // maps to Resources (placeholder) in App.jsx

  // download handler — calls the same download helper you use elsewhere
  const handleDownloadXlsx = async () => {
    try {
      // You can replace LOCAL_XLSX_PATH with "http://127.0.0.1:8000/download/dev-xlsx"
      // if you added the dev endpoint on the backend.
      await downloadFile(LOCAL_XLSX_PATH, SUGGESTED_XLSX_FILENAME);
      alert("Download started (if the path is served by the backend).");
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download XLSX: " + (err.message || err));
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good evening, Virat</h1>
          <p className="text-sm text-gray-500">Virat's Org</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-3 py-2 bg-blue-50 rounded">Admin</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickActionButton
              title="My Timetables"
              color="blue"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8h18M7 4v4M17 4v4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              onClick={goMyTimetables}
            />

            <QuickActionButton
              title="Substitute & Leave"
              color="orange"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zM6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              onClick={goSubstitute}
            />

            <QuickActionButton
              title="Manage Users"
              color="green"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              onClick={goManageUsers}
            />

            <QuickActionButton
              title="View Calendar"
              color="teal"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.6" />
                </svg>
              }
              onClick={goCalendar}
            />
          </div>

          {/* Small extra action row for downloads / exports */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Exports</h3>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadXlsx}
                className="px-4 py-2 bg-white border rounded hover:bg-gray-50"
              >
                Download XLSX
              </button>
            </div>
          </div>
        </div>

        {/* Right column: placeholder — you can add overview widgets here */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Overview</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Total Timetables</div>
              <div className="text-2xl font-semibold mt-2">1</div>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Published</div>
              <div className="text-2xl font-semibold mt-2">0</div>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Drafts</div>
              <div className="text-2xl font-semibold mt-2">1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
