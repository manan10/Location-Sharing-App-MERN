import { useCallback, useState } from 'react'
import axios from 'axios'

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const sendRequest = useCallback( async (url, method='get', data=null, headers=null) => {
        setIsLoading(true)
        const uri = process.env.REACT_APP_BACKEND_URL + url

        try {
            const response = await axios({ method, url: uri, data, headers }) 
            setIsLoading(false)
            return response.data             
        } catch (error) {
            setIsLoading(false)
            // setError(error.response.data.message || 'Something Went Wrong')
            throw error
        }
    }, [])

    const clearError = () => {
        setError(null)
    }
    return { isLoading, error, sendRequest, clearError }
}
