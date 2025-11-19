import { useState } from 'react'

export default function Uploader({ project, onUploaded }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleUpload = async () => {
    if (!project) { setError('Create or select a project first'); return }
    if (!files.length) { setError('Choose at least one file'); return }
    setError(''); setUploading(true)
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('project_id', project._id)
        form.append('file', file)
        const res = await fetch(`${baseUrl}/api/uploads`, { method: 'POST', body: form })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        onUploaded({ ...data, filename: file.name })
      }
      setFiles([])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Upload 2D/3D Drawings</h3>
      <div className="flex items-center gap-3">
        <input type="file" multiple onChange={(e)=>setFiles(Array.from(e.target.files))}
               className="text-blue-200"
               accept=".pdf,.dxf,.dwg,.tiff,.tif,.step,.stp,.ifc,.obj,.nwd,.nwc,.png,.jpg,.jpeg"/>
        <button onClick={handleUpload} disabled={uploading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
      {project && <p className="text-blue-300/80 text-xs mt-2">Uploading to: {project.name}</p>}
    </div>
  )
}
