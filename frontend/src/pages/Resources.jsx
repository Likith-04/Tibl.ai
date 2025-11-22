import React from 'react'


export default function Resources() {
const classes = [10,6,7,8,9]
return (
<div>
<div className="flex items-center justify-between">
<h1 className="text-2xl font-bold">Resources</h1>
<div className="flex items-center gap-3">
<button className="px-3 py-2 border rounded">Bulk Import</button>
<button className="px-3 py-2 bg-indigo-600 text-white rounded">+ Add Class</button>
</div>
</div>


<div className="mt-4">
<div className="border rounded bg-white p-3">
<input placeholder="Search classes..." className="w-full border rounded px-3 py-2" />
</div>


<div className="mt-4 bg-white rounded shadow divide-y">
<div className="grid grid-cols-12 gap-3 p-3 font-semibold text-gray-600">
<div className="col-span-2">NAME</div>
<div className="col-span-3">SHORT NAME</div>
<div className="col-span-2">STUDENTS</div>
<div className="col-span-5 text-right">ACTIONS</div>
</div>


{classes.map((c) => (
<div className="grid grid-cols-12 gap-3 p-3 items-center" key={c}>
<div className="col-span-2 flex items-center gap-3">
<div className="w-8 h-8 rounded bg-green-400 text-white flex items-center justify-center">{c}</div>
<div>{c}</div>
</div>
<div className="col-span-3">{c}</div>
<div className="col-span-2">0</div>
<div className="col-span-5 text-right">
<button className="px-2 py-1 text-sm">✎</button>
<button className="px-2 py-1 text-sm text-red-500">🗑️</button>
</div>
</div>
))}
</div>
</div>
</div>
)
}