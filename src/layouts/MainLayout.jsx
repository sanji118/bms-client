import React from 'react'
import Navabar from '../components/Navabar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div>
        <Navabar></Navabar>
        <Outlet></Outlet>
        <Footer/>
    </div>
  )
}

export default MainLayout