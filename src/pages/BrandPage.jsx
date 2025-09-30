import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BRANDS, SAMPLE_BIKES } from '../data/bikes'
import { brands, allBikes } from "../data/bikes";

export default function BrandPage(){
  const { slug } = useParams()
  const brand = BRANDS.find(b=>b.slug===slug)
  const bikes = SAMPLE_BIKES.filter(b=>b.brand===slug)

  useEffect(()=>{ document.title = brand ? `${brand.name} Bikes — MotoHub` : 'Brand — MotoHub' },[brand])

  if(!brand) return <div className='max-w-7xl mx-auto p-8 text-white'>Brand not found. <Link to='/'>Back to Home</Link></div>

  return (
    <div className='min-h-screen bg-neutral-950 text-white'>
      <div className='relative'>
        <div className='h-56 w-full bg-gradient-to-r from-neutral-800 to-neutral-900' />
        <div className='absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-white rounded-2xl ring-1 ring-black/10 p-2 overflow-hidden grid place-content-center text-neutral-900 font-semibold'>{brand.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
            <div>
              <h1 className='text-3xl font-extrabold'>{brand.name}</h1>
              <p className='text-white/70 text-sm'>Curated models, specs, colours and prices.</p>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Popular {brand.name} Bikes</h2>
          <Link to='/' className='text-sm px-3 py-1.5 rounded-lg bg-white/10 ring-1 ring-white/15 hover:bg-white/15'>← Back to Home</Link>
        </div>

        <div className='mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {bikes.length ? bikes.map(b=>(
            <article key={b.id} className='rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-white'>{b.name}</h3>
                <span className='text-xs text-white/60'>₹{b.price.toLocaleString()}</span>
              </div>
              <div className='mt-2 text-xs text-white/60 capitalize'>{b.body}</div>
              <div className='mt-3 flex gap-2'>
                <button className='flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-medium'>Get Offers</button>
                <button className='flex-1 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white text-sm'>Compare</button>
              </div>
            </article>
          )) : (
            <div className='col-span-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 text-center'>
              <div className='text-2xl'>🏗️</div>
              <h3 className='mt-2 text-lg font-semibold'>No bikes added yet</h3>
              <p className='text-white/70 text-sm'>We will add {brand.name} models and details here. This page is wired and ready.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
