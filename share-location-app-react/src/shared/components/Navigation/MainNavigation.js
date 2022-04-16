import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Backdrop from '../UI/BackDrop/BackDrop'

import MainHeader from './MainHeader/MainHeader'
import './MainNavigation.css'
import NavLinks from './NavLinks/NavLinks'
import SideDrawer from './SideDrawer/SideDrawer'

const MainNavigation = (props) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    return (
        <React.Fragment>
            {
                isDrawerOpen 
                    ?   <Backdrop onClick={() => setDrawerOpen(false)}/>
                    :   null    
            }
            <SideDrawer show={isDrawerOpen} onClick={() => setDrawerOpen(false)}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={() => setDrawerOpen(true)}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    )
}

export default MainNavigation
