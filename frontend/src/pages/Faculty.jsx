import React, { useState } from 'react'


export default function Faculty() {
const [showForm, setShowForm] = useState(false)
const [form, setForm] = useState({ teacherId: '', name: '' })


function submit(e) {
e.preventDefault()
// replace with API call
console.log('Add faculty', form)
setShowForm(false)
setForm({ teacherId: '', name: '' })
}


return (
<div>
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold">Faculty</h1>
<div>
<button
onClick={() => setShowForm(s => !s)}
className="px-3 py-1 border rounded"
>
{showForm ? 'Close' : 'Add Faculty'}
</button>
</div>
</div>


{showForm && (
<form onSubmit={submit} className="bg-white shadow rounded p-4 mb-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
<input value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))} placeholder="Teacher ID" className="border p-2 rounded" />
<input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="border p-2 rounded" />
</div>


<div className="mt-3">
<button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
</div>
</form>
)}


<div className="bg-white shadow rounded p-4">Faculty list placeholder</div>
</div>
)
}