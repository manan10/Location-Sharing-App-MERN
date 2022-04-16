import React, { useContext, useState } from 'react'

import Card from '../../../../shared/components/UI/Card/Card'
import ErrorModal from '../../../../shared/components/UI/ErrorModal/ErrorModal'
import Button from '../../../../shared/components/UI/FormElements/Button/Button'
import LoadingSpinner from '../../../../shared/components/UI/LoadingSpinner/LoadingSpinner'
import Map from '../../../../shared/components/UI/Map/Map'
import Modal from '../../../../shared/components/UI/Modal/Modal'
import { AuthContext } from '../../../../shared/context/auth-context'
import { useHttpClient } from '../../../../shared/hooks/http-hook'
import './PlaceItem.css'

const PlaceItem = (props) => {
    const [showMap, setShowMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError} = useHttpClient()

    const confirmDeleteHandler = () => {
        setShowConfirmModal(false)
        sendRequest(`/places/${props.id}`, 
        'delete', null, { 'Authorization': 'Bearer ' + auth.token })
            .then(() => props.onDelete(props.id))
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Modal 
                show={showMap}
                onCancel={() => setShowMap(false)}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={ <Button onClick={() => setShowMap(false)}>CLOSE</Button> }
            >
                <div className="map-container">
                    <Map 
                        center={props.coordinates}
                        zoom={16}
                        />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={() => setShowConfirmModal(false)}>CANCEL</Button>
                        <Button danger onClick={() => confirmDeleteHandler()}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter.</p>
            </Modal>

            <li className="place-item">
                <Card className="place-item__content">
                    { isLoading ? <LoadingSpinner asOverlay/> : null }
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title}/>
                    </div>
                    <div className="place-item__info">
                        <h2> {props.title} </h2>
                        <h3> {props.address} </h3>
                        <p> {props.description} </p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={ () => setShowMap(true) }>VIEW IN MAP</Button>
                        {
                            auth.userId === props.creatorId ? 
                                <React.Fragment>
                                    <Button to={`/places/${props.id}`}>EDIT</Button>
                                    <Button danger onClick={() => setShowConfirmModal(true)}>DELETE</Button>
                                </React.Fragment> : null
                        }
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default PlaceItem
