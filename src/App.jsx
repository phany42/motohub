import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BrandPage from './pages/BrandPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className='min-h-screen flex flex-col bg-neutral-950 text-white'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/brands/:slug' element={<BrandPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
