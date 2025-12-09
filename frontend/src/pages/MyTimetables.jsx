// src/pages/MyTimetables.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateTimetable, downloadFile } from "../api/timetable";
import TimetableTable from "../components/TimetableTable";

/**
 * Responsive MyTimetables page.
 * - Timetable panel will fill the remaining viewport below the page header.
 * - Tabs collapse to a select on small screens.
 *
 * The Download XLSX button fetches the XLSX at this server-side path:
 * /mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx
 * (your environment/tooling will transform the path into a proper URL before serving it).
 */

export default function MyTimetables({ user }) {
  const [loading, setLoading] = useState(false);
  const [loadingJson, setLoadingJson] = useState(false);
  const [sectionsData, setSectionsData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState(null);

  // height reserved for header (adjust if your header is taller)
  const headerHeight = 120; // px

  const [searchParams] = useSearchParams();
  const viewTeacherId = searchParams.get("teacherId");

  // Determine if we should show a specific teacher's timetable
  const targetTeacherId = viewTeacherId;

  async function fetchJsonByUrl(url) {
    setLoadingJson(true);
    setError(null);
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch JSON: ${resp.status}`);
      const data = await resp.json();
      setSectionsData(data);
      const keys = Object.keys(data || {});
      setSelectedSection(keys.length ? keys[0] : null);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      setSectionsData(null);
      setSelectedSection(null);
    } finally {
      setLoadingJson(false);
    }
  }

  const fetchTeacherTimetable = async (teacherId) => {
    setLoadingJson(true);
    setError(null);
    try {
      const resp = await fetch(`http://localhost:8000/timetable/teacher/${teacherId}`);
      if (!resp.ok) throw new Error("Failed to fetch teacher timetable");
      const data = await resp.json();
      setSectionsData(data);
      setSelectedSection("My Schedule");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingJson(false);
    }
  }

  // Initial load
  useEffect(() => {
    if (targetTeacherId) {
      fetchTeacherTimetable(targetTeacherId);
    } else {
      // Default behavior for Admin (load all)
      loadLatest();
    }
  }, [targetTeacherId]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateTimetable();
      const jsonUrl = result.json_url && result.json_url.startsWith("http")
        ? result.json_url
        : `http://127.0.0.1:8000${result.json_url}`;
      await fetchJsonByUrl(jsonUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      alert("Failed to generate timetable: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Load latest generated JSON (derives json path from /latest -> /json/)
  const loadLatest = async () => {
    try {
      setLoadingJson(true);
      setError(null);
      const latestResp = await fetch("http://127.0.0.1:8000/latest");
      if (!latestResp.ok) throw new Error("No generated files found");
      const latest = await latestResp.json(); // { filename, download_url }
      const jsonUrl = `http://127.0.0.1:8000${latest.download_url.replace("/download/", "/json/")}`;
      await fetchJsonByUrl(jsonUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      setSectionsData(null);
    } finally {
      setLoadingJson(false);
    }
  };

  // Download XLSX from server-local path (your tool will convert this path to an HTTP URL)
  // <-- this is the local path you uploaded; transform to URL in your runtime if needed
  const LOCAL_XLSX_PATH = "/mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx";
  const handleDownloadXlsx = async () => {
    try {
      setLoading(true);
      const suggestedFilename = "All_Timetables_with_Teachers_fixed_v2.xlsx";

      // If your tool converts LOCAL_XLSX_PATH to an HTTP URL automatically, downloadFile will work.
      // Alternatively, you can use the dev endpoint: http://127.0.0.1:8000/download/dev-xlsx
      await downloadFile(LOCAL_XLSX_PATH, suggestedFilename);
      alert("Download initiated (if path is served by backend).");
    } catch (err) {
      console.error(err);
      alert("Failed to download XLSX: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Responsive tabs (select on small screens)
  function SectionTabs() {
    if (!sectionsData) return null;
    const keys = Object.keys(sectionsData);
    if (keys.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="sm:hidden mb-2">
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            {keys.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedSection(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedSection === k
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Timetables</h1>
          <p className="text-slate-500 mt-1">Manage all your timetables and track their status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm flex items-center gap-2 ${loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 hover:shadow-md shadow-primary-500/20"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                New Timetable
              </>
            )}
          </button>

          <button
            onClick={loadLatest}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Load Latest
          </button>

          <button
            onClick={handleDownloadXlsx}
            disabled={loading}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            {loading ? "Downloading..." : "Export XLSX"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <SectionTabs />
        </div>

        <div className="flex-1 overflow-auto p-0 bg-white relative">
          {loadingJson && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading timetable data...</p>
              </div>
            </div>
          )}

          {!loadingJson && !sectionsData && (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No Timetable Loaded</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Get started by generating a new timetable or loading the latest saved version.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={handleGenerate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">Generate New</button>
                <button onClick={loadLatest} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">Load Latest</button>
              </div>
            </div>
          )}

          {!loadingJson && sectionsData && selectedSection && (
            <div className="h-full overflow-auto">
              <TimetableTable data={sectionsData[selectedSection]} sectionName={selectedSection} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

