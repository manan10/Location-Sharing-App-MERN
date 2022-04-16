import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import Input from '../../shared/components/UI/FormElements/Input/Input';
import Button from '../../shared/components/UI/FormElements/Button/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/components/UI/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner/LoadingSpinner';
import ImageUpload from '../../shared/components/UI/FormElements/ImageUpload/ImageUpload';

const NewPlace = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()
  const { isLoading, error, sendRequest, clearError} = useHttpClient()
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const placeSubmitHandler = event => {
    event.preventDefault();

    const requestData = new FormData()
    requestData.append('title', formState.inputs.title.value)
    requestData.append('description', formState.inputs.description.value)
    requestData.append('address', formState.inputs.address.value)
    requestData.append('image', formState.inputs.image.value)
    console.log(formState)

    sendRequest('/places', 'post', requestData, { 'Authorization': 'Bearer ' + auth.token }).then(() => history.push('/'))
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <form className="place-form" onSubmit={placeSubmitHandler}>
        { isLoading ? <LoadingSpinner asOverlay /> : null }
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please Provide an Image" center/>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
