import { useEffect, useState } from 'react'

export default function ResultsPanel({ project }) {
  const [uploads, setUploads] = useState([])
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    if (!project) return
    setLoading(true)
    try {
      const upRes = await fetch(`${baseUrl}/api/uploads?project_id=${project._id}`)
      const upData = await upRes.json()
      setUploads(upData.uploads || [])

      const exRes = await fetch(`${baseUrl}/api/extractions?project_id=${project._id}`)
      const exData = await exRes.json()
      const tagItems = (exData.items || []).filter(i => i.kind === 'tag')
      setTags(tagItems)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [project?._id])

  const generate = async (doc_type) => {
    setStatus('')
    const res = await fetch(`${baseUrl}/api/documents/generate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: project._id, doc_type })
    })
    const data = await res.json()
    if (res.ok) {
      setStatus(`${data.document.title} created with ${data.document.items.length} rows`)
    } else {
      setStatus(data.detail || 'Failed')
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Results</h3>
        <button onClick={load} className="text-blue-300 text-sm hover:underline">Refresh</button>
      </div>

      {!project ? (
        <p className="text-blue-200/80 text-sm">Create or select a project to see results.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-blue-200 mb-2">Uploads</h4>
            <div className="text-xs text-blue-100/80 space-y-1 max-h-40 overflow-auto">
              {uploads.map(u => (
                <div key={u._id || u.filepath} className="flex items-center justify-between bg-slate-900/40 rounded px-2 py-1">
                  <span className="truncate">{u.filename}</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-slate-700 text-blue-200">{u.filetype}</span>
                </div>
              ))}
              {!uploads.length && <p className="italic">No uploads yet</p>}
            </div>
          </div>

          <div>
            <h4 className="text-blue-200 mb-2">Detected Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded bg-blue-600/20 text-blue-200 border border-blue-400/20">{t.label}</span>
              ))}
              {!tags.length && <p className="text-blue-200/80 text-sm">No tags detected yet</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <button disabled={!project} onClick={() => generate('tag-index')}
                    className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-50">Generate Tag Index</button>
            <button disabled={!project} onClick={() => generate('bom')}
                    className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50">Generate BOM</button>
          </div>

          {status && <p className="text-blue-200 text-sm">{status}</p>}
        </div>
      )}

      {loading && <p className="text-blue-300 text-sm mt-2">Loading...</p>}
    </div>
  )
}
