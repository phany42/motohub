import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 bg-neutral-900/60 backdrop-blur border-b border-white/6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 grid place-content-center text-white font-bold'>Mh</div>
          <Link to='/' className='text-white font-semibold text-lg'>MotoHub</Link>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <Link to='/' className='text-white/80 hover:text-white'>Home</Link>
          <Link to='/brands/royal-enfield' className='text-white/80 hover:text-white'>Brands</Link>
          <Link to='/compare' className='text-white/80 hover:text-white'>Compare</Link>
        </div>
        <div className='flex items-center gap-3'>
          <button className='px-3 py-1 rounded-md text-white/80 hover:bg-white/5'>Login</button>
        </div>
      </div>
    </header>
  )
}
