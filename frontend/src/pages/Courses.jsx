import React, { useState } from 'react'


export default function Courses() {
const [showForm, setShowForm] = useState(false)
const [form, setForm] = useState({ branch: '', subjectType: '', subjectName: '', credits: '' })


function submit(e) {
e.preventDefault()
console.log('Add course', form)
setShowForm(false)
setForm({ branch: '', subjectType: '', subjectName: '', credits: '' })
}


return (
<div>
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold">Courses</h1>
<div>
<button
onClick={() => setShowForm(s => !s)}
className="px-3 py-1 border rounded"
>
{showForm ? 'Close' : 'Add Course'}
</button>
</div>
</div>


{showForm && (
<form onSubmit={submit} className="bg-white shadow rounded p-4 mb-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
<input value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} placeholder="Branch" className="border p-2 rounded" />
<input value={form.subjectType} onChange={e => setForm(f => ({ ...f, subjectType: e.target.value }))} placeholder="Subject Type" className="border p-2 rounded" />
<input value={form.subjectName} onChange={e => setForm(f => ({ ...f, subjectName: e.target.value }))} placeholder="Subject Name" className="border p-2 rounded" />
<input value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} placeholder="Credits" className="border p-2 rounded" />
</div>


<div className="mt-3">
<button className="px-3 py-1 bg-blue-600 text-white rounded">Save Course</button>
</div>
</form>
)}


<div className="bg-white shadow rounded p-4">Course list placeholder</div>
</div>
)
}