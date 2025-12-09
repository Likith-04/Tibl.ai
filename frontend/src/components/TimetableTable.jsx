import React from 'react';

export default function TimetableTable({ data = [], sectionName }) {
    if (!data || !data.length) {
        return <div className="p-12 text-center text-slate-500">No rows found for {sectionName}</div>;
    }

    const allKeys = new Set();
    data.forEach(row => {
        Object.keys(row).forEach(k => allKeys.add(k));
    });

    // Sort keys to ensure Day is first and times are in order
    const sortedKeys = Array.from(allKeys).sort((a, b) => {
        if (a === "Day") return -1;
        if (b === "Day") return 1;
        return a.localeCompare(b);
    });

    const dayFirst = sortedKeys;

    return (
        <div className="min-w-full inline-block align-middle">
            <div className="border-b border-slate-100">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            {dayFirst.map((c) => (
                                <th key={c} scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 border-b border-slate-200">
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {data.map((row, ri) => (
                            <tr key={ri} className="hover:bg-slate-50/50 transition-colors">
                                {dayFirst.map((c) => {
                                    const raw = row[c];
                                    const text = raw === null || raw === undefined || raw === "NaN" ? "-" : String(raw);
                                    return (
                                        <td key={c} className="px-6 py-4 whitespace-pre-wrap text-sm text-slate-700 align-top" style={{ maxWidth: 280 }}>
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
