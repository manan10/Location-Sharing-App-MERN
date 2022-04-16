import React from 'react'
import UsersListItem from './UsersListItem/UsersListItem'

import classes from './UsersList.module.css'
import Card from '../../shared/components/UI/Card/Card'

const UsersList = (props) => {
    if(props.items.length === 0){
        return (
            <div className="center">
                <Card>
                    <h2>No Users Found</h2>
                </Card>
            </div>
        )
    }
    return (
        <ul className= {classes.UsersList}>
            {
                props.items.map(item => (
                    <UsersListItem 
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        name={item.name}
                        placeCount={item.places.length} />
                ))
            }
        </ul>
    ) 
}

export default UsersList
