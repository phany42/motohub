import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { allBikes } from "../data/bikes";
import { stickerIcons } from "../data/stickers";
import StickerRow from "./StickerRow";

export default function FeaturedBikes() {
  const [index, setIndex] = useState(0)
  const items = allBikes.slice(0,8)
  const navigate = useNavigate()
  useEffect(()=>{
    const t = setInterval(()=> setIndex(v=> (v+1)%items.length), 3000)
    return ()=> clearInterval(t)
  },[items.length])
  const visible = items.slice(index).concat(items.slice(0,index)).slice(0,4)

  return (
    <section className='py-14 bg-neutral-950 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-end justify-between'>
          <h2 className='text-2xl font-bold'>Featured Bikes</h2>
          <div className='text-sm text-white/60'>Auto-rotating carousel</div>
        </div>

        <div className='mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {visible.map(b=> (
            <article key={b.id} className='group rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-white/30 transition card-float card-press'>
              <div className='p-4'>
                <img src={b.image} alt={b.name} className='w-full h-32 object-cover rounded-lg mb-3' />
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-white'>{b.name}</h3>
                  <span className='text-xs text-white/60'>{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(b.price)}</span>
                </div>
                <div className='mt-2 text-xs text-white/60 capitalize'>{b.brand.replace('-',' ')}</div>
                <div className='mt-3'>
                  <StickerRow items={stickerIcons.slice(0, 3)} />
                </div>
                <div className='mt-4 flex gap-2'>
                  <button onClick={()=> navigate(`/bike/${b.brandSlug}/${b.slug}`)} className='flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-medium'>View</button>
                  <button className='flex-1 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white text-sm'>Compare</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
