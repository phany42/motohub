import React from 'react'
import hero from '../assets/hero-bike.svg'
import GlobalSearch from './GlobalSearch'

export default function Hero() {
  return (
    <section className='relative h-[56vh] min-h-[420px]'>
      <div className='absolute inset-0'>
        <img src={hero} alt='hero' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-b from-neutral-900/70 to-neutral-950' />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center'>
        <div className='max-w-2xl'>
          <p className='text-white/80 text-sm tracking-wider uppercase mb-2'>MotoHub</p>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight'>
            Find the <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500'>Right Bike</span>
          </h1>
          <p className='mt-3 text-white/80'>Get comprehensive information on bikes and scooters, compare specs, explore colours, and check on-road prices.</p>

          <div className='mt-6'>
            <GlobalSearch />
          </div>
        </div>
      </div>
    </section>
  )
}
