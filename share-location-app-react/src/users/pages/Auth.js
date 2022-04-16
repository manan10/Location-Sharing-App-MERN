import React, { useContext, useState } from 'react'

import Card from '../../shared/components/UI/Card/Card'
import Button from '../../shared/components/UI/FormElements/Button/Button'
import Input from '../../shared/components/UI/FormElements/Input/Input'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner/LoadingSpinner'
import ErrorModal from '../../shared/components/UI/ErrorModal/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'

import './Auth.css'
import ImageUpload from '../../shared/components/UI/FormElements/ImageUpload/ImageUpload'

const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const authSubmitHandler = (event) => {
        event.preventDefault()
        if(isLoginMode){
            const loginData = {
                email: formState.inputs.email.value,
                password: formState.inputs.password.value,
            }
            sendRequest('/users/login', 'post', loginData).then((response) => auth.login(response.userId, response.token))
        } else {
            const signupData = new FormData()
            signupData.append('email', formState.inputs.email.value)
            signupData.append('name', formState.inputs.name.value)
            signupData.append('password', formState.inputs.password.value)
            signupData.append('image', formState.inputs.image.value)

            sendRequest('/users/signup', 'post', signupData).then((response) => auth.login(response.userId, response.token))
        }
    }

    const switchModeHandler = () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode)
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Card className="authentication">
                { isLoading ? <LoadingSpinner asOverlay/> : null }
                <h2 className="authentication__header">{ isLoginMode ? 'Log-In' : 'Sign-Up'}</h2>
                <hr></hr>
                <form onSubmit={authSubmitHandler}>
                    {
                        !isLoginMode 
                        ?   <Input 
                                element="input"
                                id="name"
                                type="text"
                                label="Your Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Enter Your Name"
                                onInput={inputHandler} />
                        : null
                    }
                    { !isLoginMode ? <ImageUpload id="image" center onInput={inputHandler} errorText="Please provide an image"/> : null }

                    <Input 
                        element="input" 
                        id="email" 
                        type="email" 
                        label="E-Mail" 
                        validators={[VALIDATOR_EMAIL()]} 
                        errorText="Enter a valid Email"
                        onInput={inputHandler} />

                    <Input 
                        element="input" 
                        id="password" 
                        type="password" 
                        label="Password" 
                        validators={[VALIDATOR_MINLENGTH(6)]} 
                        errorText="Enter valid Password"
                        onInput={inputHandler} />

                    <Button type="submit" disabled={!formState.isValid}>
                        { isLoginMode ? 'LOGIN' : 'SIGNUP' }
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    Switch To { !isLoginMode ? 'LOGIN' : 'SIGNUP' }
                </Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth
