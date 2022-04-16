import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorModal from '../../shared/components/UI/ErrorModal/ErrorModal'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import PlaceList from '../components/PlaceList/PlaceList'


const UserPlaces = () => {
    const userId = useParams().id
    const [userPlaces, setUserPlaces] = useState()
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const placeDeletedHandler = (deletedPlaceId) => {
        setUserPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }
    useEffect(() => {
        const fetchUsers = () => {
            sendRequest(`/places/user/${userId}`).then((response) => setUserPlaces(response.places))
        }
        fetchUsers()
    }, [sendRequest, userId])

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            { isLoading ? <LoadingSpinner asOverlay /> : null }
            { 
            !isLoading && userPlaces 
                ?   <PlaceList items={userPlaces} onDeletePlace={placeDeletedHandler}/>
                :   null
            }
        </React.Fragment>
    )
}

export default UserPlaces
