import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './footer'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import BlockedUserPage from './BlockedUser'

function Layout() {

    const user = useSelector((state)=>state.auth.user);
    if(user?.isBlocked){
        return(
            <BlockedUserPage/>
        )
    }

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
