import { useEffect, useState } from 'react'
import ProjectCreator from './components/ProjectCreator'
import Uploader from './components/Uploader'
import ResultsPanel from './components/ResultsPanel'

function App() {
  const [projects, setProjects] = useState([])
  const [current, setCurrent] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadProjects = async () => {
    const res = await fetch(`${baseUrl}/api/projects`)
    if (res.ok) {
      const data = await res.json()
      const items = (data.projects || []).map(p => ({ ...p, _id: p._id || p.id }))
      setProjects(items)
      if (!current && items.length) setCurrent(items[0])
    }
  }

  useEffect(() => { loadProjects() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-white font-semibold">OG Doc AI</h1>
        </div>
        <a href="/test" className="text-blue-300 text-sm hover:underline">Status</a>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <ProjectCreator onCreated={(p)=>{ setProjects([p, ...projects]); setCurrent(p) }} />
            <Uploader project={current} onUploaded={()=>{}} />
            <ResultsPanel project={current} />
          </div>

          <aside className="bg-slate-800/60 border border-blue-400/20 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Projects</h3>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {projects.map(p => (
                <button key={p._id}
                        onClick={()=>setCurrent(p)}
                        className={`w-full text-left px-3 py-2 rounded border ${current?._id===p._id? 'bg-blue-600/20 border-blue-400/40 text-blue-100' : 'bg-slate-900/40 border-slate-700 text-blue-200/90'}`}>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-blue-300/70">{p.code || '—'}</div>
                </button>
              ))}
              {!projects.length && <p className="text-blue-200/80 text-sm italic">No projects yet</p>}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
