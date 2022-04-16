import React from 'react'
import { Link } from 'react-router-dom'

import Avatar from '../../../shared/components/UI/Avatar/Avatar'
import Card from '../../../shared/components/UI/Card/Card'
import classes from './UsersListItem.module.css'

const UsersListItem = (props) => {
    return (
        <li className={classes.UserItem}>
            <Card className={classes.UserItem__content}>    
                <Link to={`/${props.id}/places`}>
                    <div className={classes.UserItem__image}>
                        <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name}/>
                    </div>
                    <div className={classes.UserItem__info}>
                        <h2> {props.name} </h2>
                        <h3> No of Places: {props.placeCount} </h3>
                    </div>
                </Link> 
            </Card>
        </li>
    )
}

export default UsersListItem
