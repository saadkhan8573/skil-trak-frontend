import { SessionExpireModal } from '@components'
import { CommonApi, useRefreshTokenMutation } from '@queries'
import { AuthUtils, isBrowser } from '@utils'
import { useRouter } from 'next/router'
import {
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

interface AutoLogoutType {
    isUserActive: boolean
    resetTimer: () => void
}

export const AutoLogoutContext = createContext<AutoLogoutType | null>(null)

export enum LogoutType {
    Auto = 'auto',
    Manual = 'manual',
}

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes
const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000 // 4 minutes
const TOKEN_REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000 // 5 minutes before expiry

export const AutoLogoutProvider = ({
    children,
}: {
    children: ReactElement | ReactNode
}) => {
    const router = useRouter()
    const [isUserActive, setIsUserActive] = useState(true)
    const [modal, setModal] = useState<ReactNode | null>(null)
    const lastActivityTime = useRef(Date.now())
    const refreshTokenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [logoutActivity] = CommonApi.LogoutActivity.perFormAcivityOnLogout()
    const [refreshToken, refreshTokenResult] = useRefreshTokenMutation()

    const clearAllTimeouts = useCallback(() => {
        if (refreshTokenTimeoutRef.current) {
            clearTimeout(refreshTokenTimeoutRef.current)
        }
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current)
        }
    }, [])

    const handleLogout = useCallback(async () => {
        if (AuthUtils.token()) {
            try {
                await logoutActivity({ type: LogoutType.Auto })
                AuthUtils.logout()
                setIsUserActive(false)
                setModal(<SessionExpireModal onCancel={() => setModal(null)} />)
            } catch (error) {}
        }
    }, [logoutActivity])

    const updateTokens = useCallback(async () => {
        try {
            const result: any = await refreshToken()
            if (result?.data) {
                const rememberLogin =
                    isBrowser() && localStorage.getItem('rememberMe')
                if (rememberLogin) {
                    AuthUtils.setToken(result.data.access_token)
                    AuthUtils.setRefreshToken(result.data.refreshToken)
                } else {
                    AuthUtils.setTokenToSession(result.data.access_token)
                    AuthUtils.setRefreshTokenToSessionStorage(
                        result.data.refreshToken
                    )
                }
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }, [refreshToken])

    const setupTokenRefresh = useCallback(() => {
        if (!AuthUtils.isAuthenticated()) return

        const credentials = AuthUtils.getUserCredentials()
        if (!credentials?.exp) return

        const expiryTime = credentials.exp * 1000
        const currentTime = Date.now()
        const timeUntilRefresh = Math.max(
            60000, // Minimum 1 minute delay to prevent immediate refresh
            Math.min(
                TOKEN_REFRESH_INTERVAL, // Maximum 4 minutes
                expiryTime - TOKEN_REFRESH_BEFORE_EXPIRY - currentTime
            )
        )

        clearTimeout(refreshTokenTimeoutRef.current!)
        refreshTokenTimeoutRef.current = setTimeout(async () => {
            const success = await updateTokens()
            if (success) {
                setupTokenRefresh() // Setup next refresh only if current one succeeded
            } else {
                handleLogout()
            }
        }, timeUntilRefresh)
    }, [updateTokens, handleLogout])

    const resetInactivityTimer = useCallback(() => {
        lastActivityTime.current = Date.now()
        clearTimeout(inactivityTimeoutRef.current!)

        inactivityTimeoutRef.current = setTimeout(() => {
            handleLogout()
        }, INACTIVITY_TIMEOUT)
    }, [handleLogout])

    // Setup initial timers
    useEffect(() => {
        const path = router.asPath?.split('/')
        if (AuthUtils.isAuthenticated() && path?.includes('portals')) {
            setupTokenRefresh()
            resetInactivityTimer()
        }

        return clearAllTimeouts
    }, [
        router.asPath,
        setupTokenRefresh,
        resetInactivityTimer,
        clearAllTimeouts,
    ])

    // Broadcast channel setup for multi-tab synchronization
    useEffect(() => {
        const channel = new BroadcastChannel('autoLogoutChannel')

        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'activity') {
                resetInactivityTimer()
            } else if (event.data === 'logout') {
                handleLogout()
            }
        }

        channel.addEventListener('message', handleMessage)
        return () => {
            channel.removeEventListener('message', handleMessage)
            channel.close()
        }
    }, [resetInactivityTimer, handleLogout])

    const handleUserActivity = useCallback(() => {
        if (!AuthUtils.isAuthenticated()) return

        resetInactivityTimer()
        const channel = new BroadcastChannel('autoLogoutChannel')
        channel.postMessage('activity')
        channel.close()
    }, [resetInactivityTimer])

    const value = {
        isUserActive,
        resetTimer: handleUserActivity,
    }

    return (
        <AutoLogoutContext.Provider value={value}>
            {modal}
            <div
                onClick={handleUserActivity}
                onKeyDown={handleUserActivity}
                onMouseMove={handleUserActivity}
                onScroll={handleUserActivity}
            >
                {children}
            </div>
        </AutoLogoutContext.Provider>
    )
}

export const useAutoLogout = () => {
    return useContext(AutoLogoutContext) as AutoLogoutType
}
