import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './footer'
import Navbar from './Navbar'

function Layout() {
    return (
        <div className='flex flex-col min-h-screen'>
        <Navbar/>
        <div className='flex-1 mt-16'>
            <Outlet/>
        </div>
        <Footer/>

    </div>
    )
}

export default Layout
