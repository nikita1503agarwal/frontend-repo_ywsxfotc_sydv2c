import { useState } from 'react'

export default function ProjectCreator({ onCreated }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [revision, setRevision] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const create = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Please enter a project name')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, description, revision })
      })
      if (!res.ok) throw new Error('Failed to create project')
      const data = await res.json()
      onCreated({ _id: data.project_id, name, code, description, revision })
      setName(''); setCode(''); setDescription(''); setRevision('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Create a Project</h3>
      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="bg-slate-900/60 text-white rounded px-3 py-2 outline-none border border-slate-700" placeholder="Project name*" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="bg-slate-900/60 text-white rounded px-3 py-2 outline-none border border-slate-700" placeholder="Project code" value={code} onChange={(e)=>setCode(e.target.value)} />
        <input className="bg-slate-900/60 text-white rounded px-3 py-2 outline-none border border-slate-700 md:col-span-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <div className="flex gap-3 md:col-span-2">
          <input className="flex-1 bg-slate-900/60 text-white rounded px-3 py-2 outline-none border border-slate-700" placeholder="Revision" value={revision} onChange={(e)=>setRevision(e.target.value)} />
          <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
    </div>
  )
}
