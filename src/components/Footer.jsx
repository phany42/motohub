import React from 'react'

export default function Footer() {
  return (
    <footer className='mt-24 bg-neutral-900 text-white/70'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-3'>
        <div>
          <div className='text-white text-xl font-semibold'>MotoHub</div>
          <p className='mt-2 text-sm'>Find the right bike with immersive comparisons, rich visuals and real-world ownership data.</p>
        </div>
        <div>
          <div className='text-white font-medium'>Popular Sections</div>
          <ul className='mt-3 space-y-2 text-sm'>
            <li><a className='hover:text-white' href='/'>Home</a></li>
            <li><a className='hover:text-white' href='/brands/royal-enfield'>Royal Enfield</a></li>
            <li><a className='hover:text-white' href='/compare'>Compare</a></li>
          </ul>
        </div>
        <div>
          <div className='text-white font-medium'>Stay Updated</div>
          <div className='mt-3 flex gap-2'>
            <input placeholder='Enter email' className='px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/10 placeholder-white/50 text-sm flex-1 outline-none' />
            <button className='px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-medium shadow'>Subscribe</button>
          </div>
        </div>
      </div>
      <div className='border-t border-white/10 py-4 text-center text-xs'>© {new Date().getFullYear()} MotoHub. Built for demo purposes.</div>
    </footer>
  )
}
