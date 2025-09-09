import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  useEffect(()=>{ document.title = '404 — MotoHub' },[])
  return (
    <section className='flex flex-col items-center justify-center h-[60vh] text-white'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-white/70 mb-6'>Page not found</p>
      <Link to='/' className='px-4 py-2 rounded bg-orange-500 text-white'>Back to Home</Link>
    </section>
  )
}
