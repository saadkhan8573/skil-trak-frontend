import React, { useState, useEffect, useCallback, ReactElement } from 'react'
import { CommonApi, useRefreshTokenMutation } from '@queries'
import { AuthUtils, isBrowser } from '@utils'
import { LogoutType } from './useAutoLogout'
import { useRouter } from 'next/router'
import { SessionExpireModal } from '@components'

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes
const TOKEN_REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000 // 5 minutes before expiry
const TOKEN_CHECK_INTERVAL = 60 * 1000 // Check every 1 minute instead of 10 seconds

const SessionManager: React.FC = () => {
    const router = useRouter()

    const [modal, setModal] = useState<ReactElement | null>(null)
    const [lastActivity, setLastActivity] = useState(Date.now())

    const [logoutActivity] = CommonApi.LogoutActivity.perFormAcivityOnLogout()
    const [refreshToken] = useRefreshTokenMutation()

    const token = AuthUtils.token()
    const isAuthenticated = AuthUtils.isAuthenticated()

    // Get the token ID (you might need to adjust this based on your token structure)
    const getTokenId = useCallback(() => {
        const userCredentials = AuthUtils.getUserCredentials()
        return userCredentials?.id || null
    }, [])

    // Broadcast channel setup for multi-tab synchronization
    const broadcastLogout = useCallback(() => {
        const channel = new BroadcastChannel('autoLogoutChannel')
        // Include token ID in the message
        channel.postMessage({
            type: 'logout',
            tokenId: getTokenId(),
        })
        channel.close()
    }, [getTokenId])

    // Logout handler
    const handleLogout = useCallback(async () => {
        if (AuthUtils.token()) {
            try {
                await logoutActivity({ type: LogoutType.Auto })
                AuthUtils.logout()

                // Trigger logout across tabs
                broadcastLogout()

                // Show session expire modal
                setModal(<SessionExpireModal onCancel={() => setModal(null)} />)
            } catch (error) {
                console.error('Logout failed:', error)
            }
        }
    }, [logoutActivity, broadcastLogout])

    // Reset activity timer and broadcast to other tabs
    const resetActivityTimer = useCallback(() => {
        if (!isAuthenticated) return

        setLastActivity(Date.now())

        // Broadcast activity to other tabs
        const channel = new BroadcastChannel('autoLogoutChannel')
        channel.postMessage({
            type: 'activity',
            tokenId: getTokenId(),
        })
        channel.close()
    }, [isAuthenticated, getTokenId])

    // Broadcast channel listener effect
    useEffect(() => {
        const channel = new BroadcastChannel('autoLogoutChannel')

        const handleMessage = (event: MessageEvent) => {
            // Check if the message has a tokenId and if it matches the current token's ID
            if (!event.data || event.data.tokenId !== getTokenId()) {
                return // Ignore messages from different token sessions
            }

            if (event.data.type === 'activity') {
                // Reset local activity timer when another tab reports activity
                setLastActivity(Date.now())
            } else if (event.data.type === 'logout') {
                // Trigger logout if another tab signals logout
                handleLogout()
            }
        }

        channel.addEventListener('message', handleMessage)

        return () => {
            channel.removeEventListener('message', handleMessage)
            channel.close()
        }
    }, [handleLogout, getTokenId])

    // Inactivity and token management effect
    useEffect(() => {
        // Add event listeners for user activity
        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click']
        const eventHandler = () => resetActivityTimer()

        activityEvents.forEach((event) =>
            window.addEventListener(event, eventHandler)
        )

        // Interval to check inactivity and token status
        const checkInterval = setInterval(async () => {
            const currentTime = Date.now()

            // Check inactivity
            if (
                currentTime - lastActivity > INACTIVITY_TIMEOUT ||
                currentTime > AuthUtils.getUserCredentials()?.exp * 1000
            ) {
                handleLogout()
            }

            // Check token refresh (before expiry)
            if (isAuthenticated) {
                const credentials = AuthUtils.getUserCredentials()
                if (credentials?.exp) {
                    const expirationTime = credentials.exp * 1000
                    const timeRemaining = expirationTime - currentTime

                    // Refresh token if within the refresh window and on portal pages
                    // Only refresh if we have more than 30 seconds left to avoid race conditions
                    if (
                        timeRemaining <= TOKEN_REFRESH_BEFORE_EXPIRY &&
                        timeRemaining > 30000 && // 30 seconds buffer
                        router.asPath?.split('/').includes('portals')
                    ) {
                        try {
                            const result: any = await refreshToken()
                            if (result?.data) {
                                const rememberLogin =
                                    isBrowser() &&
                                    localStorage.getItem('rememberMe')
                                if (rememberLogin) {
                                    AuthUtils.setToken(
                                        result?.data?.access_token
                                    )
                                    AuthUtils.setRefreshToken(
                                        result?.data?.refreshToken
                                    )
                                } else {
                                    AuthUtils.setTokenToSession(
                                        result?.data?.access_token
                                    )
                                    AuthUtils.setRefreshTokenToSessionStorage(
                                        result?.data?.refreshToken
                                    )
                                }
                                // Update last activity to prevent immediate logout after refresh
                                setLastActivity(currentTime)
                            }
                        } catch (error) {
                            // If token refresh fails, logout
                            handleLogout()
                        }
                    }
                }
            }
        }, TOKEN_CHECK_INTERVAL) // Check every 1 minute

        // Cleanup
        return () => {
            activityEvents.forEach((event) =>
                window.removeEventListener(event, eventHandler)
            )
            clearInterval(checkInterval)
        }
    }, [
        lastActivity,
        isAuthenticated,
        handleLogout,
        resetActivityTimer,
        refreshToken,
        router.asPath,
        AuthUtils.getUserCredentials()?.exp,
    ])

    return <>{modal}</>
}

export default SessionManager
