import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import BrowseTabs from '../components/BrowseTabs'
import PriceWidget from '../components/PriceWidget'
import FeaturedBikes from '../components/FeaturedBikes'

export default function Home(){
  useEffect(()=>{ document.title = 'MotoHub — Find the Right Bike' },[])
  return (
    <main>
      <Hero />
      <BrowseTabs />
      <PriceWidget />
      <FeaturedBikes />
    </main>
  )
}
