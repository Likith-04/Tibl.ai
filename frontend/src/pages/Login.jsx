import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'


export default function Login(){
const [user,setUser]=useState('admin')
const [pass,setPass]=useState('')
const nav = useNavigate()
const submit = (e)=>{e.preventDefault(); if(user==='admin'){ localStorage.setItem('tibl_admin','1'); nav('/'); } else alert('use username admin') }
return (
<div className="login-page">
<form className="login-box" onSubmit={submit}>
<h2>Admin Login</h2>
<input value={user} onChange={e=>setUser(e.target.value)} />
<input type="password" value={pass} onChange={e=>setPass(e.target.value)} />
<div className="actions"><button type="submit">Login</button></div>
<p className="hint">Hint: username <strong>admin</strong></p>
</form>
</div>
)
}