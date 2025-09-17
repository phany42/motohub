import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { allBikes } from "../data/bikes";

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => {
    const term = q.toLowerCase().trim()
    if (!term) return []
    return allBikes.filter(b => b.name.toLowerCase().includes(term)).slice(0,6)
  }, [q])

  return (
    <div className='relative'>
      <div className='flex items-center gap-3 rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/5 px-4 py-3'>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search your bike here, e.g. Hunter 350' className='flex-1 bg-transparent outline-none text-neutral-800'/>
        <button className='px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold' onClick={()=>{ if(results[0]) navigate(`/brands/${results[0].brand}`)}}>Search</button>
      </div>

      {results.length>0 && (
        <div className='absolute mt-2 w-full rounded-xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden'>
          {results.map(r=> (
            <button key={r.id} onClick={()=>navigate(`/brands/${r.brand}`)} className='w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-3'>
              <div className='w-10 h-10 bg-neutral-100 rounded overflow-hidden grid place-content-center text-sm font-medium'>{r.name.slice(0,2)}</div>
              <div>
                <div className='text-sm font-medium text-neutral-900'>{r.name}</div>
                <div className='text-xs text-neutral-500 capitalize'>{r.brand.replace('-',' ')}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
