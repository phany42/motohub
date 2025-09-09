import React, { useState } from 'react'
import { BRANDS } from '../data/sampleData'
import { Link } from 'react-router-dom'

export default function BrowseTabs() {
  const tabs = ['Brand','Budget','Displacement','Body Style']
  const [tab, setTab] = useState('Brand')

  return (
    <section className='py-12 bg-neutral-950 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-2xl font-bold'>Browse Bikes By</h2>
        <div className='mt-6 flex items-center gap-6 text-sm'>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`pb-2 border-b-2 transition ${tab===t?'border-rose-500 text-white':'border-transparent text-white/70 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className='mt-8'>
          {tab==='Brand' && (
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {BRANDS.map(b=> (
                <Link key={b.slug} to={`/brands/${b.slug}`} className='group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition relative overflow-hidden'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-white rounded-xl grid place-content-center ring-1 ring-black/5 text-neutral-900 font-semibold'>{b.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
                    <div className='text-left'>
                      <div className='font-semibold'>{b.name}</div>
                      <div className='text-xs text-white/60'>Explore bikes</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* For brevity budget/displacement/body style sections show placeholders */}
          {tab==='Budget' && <div className='mt-4 text-white/70'>Budget filters and quick picks (placeholder)</div>}
          {tab==='Displacement' && <div className='mt-4 text-white/70'>Displacement ranges (placeholder)</div>}
          {tab==='Body Style' && <div className='mt-4 text-white/70'>Body style categories (placeholder)</div>}
        </div>
      </div>
    </section>
  )
}
