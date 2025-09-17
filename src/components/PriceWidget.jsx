import React, { useState, useMemo } from 'react'
import { SAMPLE_BIKES, CITIES } from '../data/bikes'
import { brands, allBikes } from "../data/bikes";

export default function PriceWidget() {
  const [city, setCity] = useState(CITIES[0])
  const [model, setModel] = useState('')
  const price = useMemo(()=>{
    const bike = SAMPLE_BIKES.find(b=>b.name.toLowerCase()===model.toLowerCase())
    if(!bike) return null
    const cityFactor = 1 + CITIES.indexOf(city)*0.01
    return Math.round(bike.price*cityFactor + 9500)
  },[city,model])

  return (
    <section className='py-16 bg-neutral-900 text-white/90'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center'>
        <div className='rounded-3xl p-6 glass ring-1 ring-white/10'>
          <div className='text-xl text-white font-semibold'>Check On-Road Price</div>
          <div className='mt-4 flex items-center gap-3 rounded-2xl bg-white/95 ring-1 ring-black/5 px-3 py-2'>
            <input list='models' value={model} onChange={e=>setModel(e.target.value)} placeholder='Type to select bike, e.g. Hunter 350' className='flex-1 bg-transparent outline-none text-neutral-800'/>
            <datalist id='models'>
              {SAMPLE_BIKES.map(b=> <option key={b.id} value={b.name} />)}
            </datalist>
          </div>
          <div className='mt-4 flex gap-3'>
            <select value={city} onChange={e=>setCity(e.target.value)} className='flex-1 px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 outline-none'>
              {CITIES.map(c=> <option key={c}>{c}</option>)}
            </select>
            <button className='px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-medium'>Get Price</button>
          </div>
          {price && <div className='mt-4 text-sm text-white/90'>Rough on-road price for <span className='font-semibold text-white'>{model}</span> in {city}: <span className='font-semibold text-white'>{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(price)}</span></div>}
        </div>

        <div className='relative'>
          <div className='rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden'>
            <img src='/src/assets/hero-bike.svg' alt='rider' className='w-full h-full object-cover'/>
          </div>
        </div>
      </div>
    </section>
  )
}
