// src/pages/MyTimetables.jsx
import React, { useEffect, useState } from "react";
import { generateTimetable, downloadFile } from "../api/timetable";

/**
 * Responsive MyTimetables page.
 * - Timetable panel will fill the remaining viewport below the page header.
 * - Tabs collapse to a select on small screens.
 *
 * The Download XLSX button fetches the XLSX at this server-side path:
 * /mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx
 * (your environment/tooling will transform the path into a proper URL before serving it).
 */

export default function MyTimetables() {
  const [loading, setLoading] = useState(false);
  const [loadingJson, setLoadingJson] = useState(false);
  const [sectionsData, setSectionsData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState(null);

  // height reserved for header (adjust if your header is taller)
  const headerHeight = 120; // px

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
      <div className="mb-3">
        <div className="sm:hidden mb-2">
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {keys.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="hidden sm:flex gap-2 overflow-x-auto pb-2">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedSection(k)}
              className={`px-3 py-2 rounded-t-lg border-b-2 ${
                selectedSection === k ? "bg-white border-indigo-600 font-semibold" : "bg-gray-100 border-transparent"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const panelStyle = {
    height: `calc(100vh - ${headerHeight}px)`,
    minHeight: "320px",
  };

  return (
    <div className="px-4 md:px-8 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Timetables</h1>
          <p className="text-sm text-gray-500">Manage all your timetables and track their status</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Generating..." : "+ New Timetable"}
          </button>

          <button onClick={loadLatest} className="px-3 py-2 border rounded bg-white">Load Latest</button>

          <button
            onClick={handleDownloadXlsx}
            disabled={loading}
            className="px-3 py-2 border rounded bg-white"
          >
            {loading ? "Downloading..." : "Download XLSX"}
          </button>
        </div>
      </div>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

      <div className="mt-6 bg-gray-50 border rounded shadow-sm p-4" style={panelStyle}>
        <div className="h-full flex flex-col">
          <div>
            <SectionTabs />
          </div>

          <div className="flex-1 overflow-auto bg-white rounded p-3 border">
            {loadingJson && <div className="p-4 text-gray-600">Loading timetable…</div>}

            {!loadingJson && !sectionsData && (
              <div className="p-6 text-gray-500">No timetable loaded. Click <strong>+ New Timetable</strong> or <strong>Load Latest</strong>.</div>
            )}

            {!loadingJson && sectionsData && selectedSection && (
              <div className="w-full overflow-auto">
                <SectionTable data={sectionsData[selectedSection]} sectionName={selectedSection} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* SectionTable: renders rows in a responsive way */
function SectionTable({ data = [], sectionName }) {
  if (!data || !data.length) {
    return <div className="p-6 text-gray-500">No rows for {sectionName}</div>;
  }

  const first = data[0] || {};
  const allCols = Object.keys(first);
  const dayFirst = allCols.includes("Day") ? ["Day", ...allCols.filter(c => c !== "Day")] : allCols;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{sectionName}</h2>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {dayFirst.map((c) => (
                <th key={c} className="px-3 py-2 text-left font-medium border-b">{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="odd:bg-white even:bg-gray-50 align-top">
                {dayFirst.map((c) => {
                  const raw = row[c];
                  const text = raw === null || raw === undefined || raw === "NaN" ? "-" : String(raw);
                  return (
                    <td key={c} className="px-3 py-2 align-top whitespace-pre-wrap" style={{verticalAlign: 'top', maxWidth: 240}}>
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
