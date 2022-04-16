import { useState, useCallback, useEffect } from 'react'

let logoutTimer = null

export const useAuth = () => {
    const [ token, setToken ] = useState(null)
    const [ tokenExpirationDate, setTokenExpirationDate ] = useState()
    const [ userId, setUserId ] = useState()

    const login = useCallback((userId, token, expirationDate) => {
        setToken(token)
        setUserId(userId)
        
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
        setTokenExpirationDate(tokenExpirationDate)

        localStorage.setItem('userData', JSON.stringify({ userId: userId, token: token, expiration: tokenExpirationDate.toISOString() }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setTokenExpirationDate(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {
        if(token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
        logoutTimer = setTimeout(logout, remainingTime)
        } else {
        clearTimeout(logoutTimer)
        }
    }, [ logout, token, tokenExpirationDate ])

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))

        if(userData && userData.token && new Date(userData.expiration > new Date())){
        login(userData.userId, userData.token, new Date(userData.expiration))
        }

    }, [login])

    return { token, login, logout, userId }
}