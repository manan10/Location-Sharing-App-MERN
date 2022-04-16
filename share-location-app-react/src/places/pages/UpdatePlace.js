import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../shared/components/UI/FormElements/Button/Button'
import Input from '../../shared/components/UI/FormElements/Input/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UI/Card/Card'

import './PlaceForm.css'
import { useHttpClient } from '../../shared/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner/LoadingSpinner'
import ErrorModal from '../../shared/components/UI/ErrorModal/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'

const UpdatePlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [ loadedPlace, setLoadedPlace ] = useState()
    const history = useHistory()
    const placeId = useParams().placeId;
    const auth = useContext(AuthContext)
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
      },
      false
    );

    useEffect(() => {
      const fetchPlace = () => {
        sendRequest(`/places/${placeId}`)
        .then((res) => {
          setLoadedPlace(res.place)
          setFormData(
            {
              title: {
                value: res.place.title,
                isValid: true
              },
              description: {
                value: res.place.description,
                isValid: true
              }
            },
            true
          );
        })
      }
      fetchPlace()
    }, [sendRequest, placeId, setFormData])
  
    const placeUpdateSubmitHandler = event => {
      event.preventDefault();
      const placeData = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }
      sendRequest(`/places/${placeId}`, 'patch', placeData, { 'Authorization': 'Bearer ' + auth.token }).then(() => history.push('/' + auth.userId + '/places'))
    }; 
 
    if (isLoading) {
      return (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      );
    }
  
    if (!loadedPlace && !error) {
      return (
        <div className="center">
          <Card>
            <h2>Could not find place!</h2>
          </Card>
        </div>
      );
    }
  
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        { 
        !isLoading && loadedPlace 
          ? <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
              <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={loadedPlace.title}
                initialValid={true}
              />
              <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min. 5 characters)."
                onInput={inputHandler}
                initialValue={loadedPlace.description}
                initialValid={true}
              />
              <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
              </Button>
            </form> 
          : null
        }
      </React.Fragment>
    );
};

export default UpdatePlace
