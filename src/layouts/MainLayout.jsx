import React from 'react'
import Navabar from '../components/Navabar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div>
        <Navabar></Navabar>
        <div className='md:pt-18'><Outlet/></div>
        <Footer/>
    </div>
  )
}

export default MainLayout