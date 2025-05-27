import React from 'react'
import Banner from './Banner'
import AboutBuilding from './AboutBuilding'
import CouponSection from './CouponSection'
import ApartmentLocation from './ApartmentLocation'

const Home = () => {
  return (
    <div>
        <Banner></Banner>
        <AboutBuilding/>
        <CouponSection/>
        <ApartmentLocation></ApartmentLocation>
    </div>
  )
}

export default Home