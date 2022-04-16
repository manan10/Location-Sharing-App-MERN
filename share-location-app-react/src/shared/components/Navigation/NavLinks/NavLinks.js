import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../context/auth-context'

import './NavLinks.css'

const NavLinks = (props) => {
    const auth = useContext(AuthContext)
    return (
        <ul className="nav-links">
            <li> <NavLink to="/" exact> ALL USERS </NavLink> </li>
            {
                auth.isLoggedIn 
                    ?   <React.Fragment>
                            <li> <NavLink to={`/${auth.userId}/places`}> MY PLACES </NavLink> </li>
                            <li> <NavLink to="/places/new"> NEW PLACE </NavLink> </li>
                            <li> <button onClick={auth.logout}>Logout</button></li> 
                        </React.Fragment> 
                    :   <li> <NavLink to="/auth"> AUTHENTICATION </NavLink> </li>
            }

        </ul>
    )
}

export default NavLinks
