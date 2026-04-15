import { useNotification, useSocketListener } from '@hooks'
import { CommonApi } from '@queries'
import { apiSlice } from '@queries/portals/empty.query'
import { AuthUtils, playAudioSound } from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { socketEventToTagMapping } from './data'
import { SocketNotificationsEvents } from './enum'

export const Socket = ({ children }: any) => {
    const router = useRouter()
    const [socket, setSocket] = useState<any | null>(null)

    const { notification } = useNotification()
    const { setEventListener } = useSocketListener()

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
        }
    }

    // utils/audioNotification.js

    useEffect(() => {
        setSocket(
            io(`${process.env.NEXT_PUBLIC_SOCKET_END_POINT}`, { secure: true })
        )

        return () => {
            setSocket(null)
        }
    }, [])

    const dispatch = useDispatch()

    const invalidateCacheForEvent = (eventName: SocketNotificationsEvents) => {
        const tagsToInvalidate = (socketEventToTagMapping as any)[eventName]
        if (tagsToInvalidate) {
            tagsToInvalidate.forEach((tag: any) => {
                dispatch(apiSlice.util.invalidateTags([tag]))
            })
        }
    }

    const [readNotifications] = CommonApi.Notifications.useIsReadNotification()

    const handleNotificationClick = async (e: any, notification: any) => {
        e?.preventDefault()

        try {
            // First mark the notification as read
            if (!notification.isRead && notification?.notificationId) {
                await readNotifications(notification?.notificationId)
            }

            // Then navigate to the link
            if (notification?.link) {
                router.push(notification?.link)
            }
        } catch (error) {
            console.error('Error handling notification click:', error)
        }
    }

    useEffect(() => {
        if (AuthUtils.isAuthenticated() && socket) {
            const userId = AuthUtils.getUserCredentials()?.id
            socket.emit('join', userId)
            socket.off('joined') // cleanup before rebind
            socket.on('joined', () => { })

            // 🚨 FIRST: Remove all previous listeners
            Object.values(SocketNotificationsEvents).forEach((event) => {
                socket.off(event) // this is crucial
            })

            // ✅ THEN register fresh listeners
            Object.values(SocketNotificationsEvents).forEach(
                (eventName: SocketNotificationsEvents) => {
                    socket.on(eventName, (notify: any) => {
                        playAudioSound('/audio/noti.wav')
                        setEventListener({
                            eventName,
                            eventListener: notify,
                        })
                        dispatch(
                            apiSlice.util.invalidateTags(['AllNotifications'])
                        )
                        invalidateCacheForEvent(eventName)

                        notification.success({
                            title: notify?.type,
                            description: notify?.message,
                            dissmissTimer: 10000,
                            primaryAction: {
                                text: 'View',
                                onClick: (e: any) => {
                                    handleNotificationClick(e, notify)
                                },
                            },
                            position: 'topright',
                        })
                    })
                }
            )

            // ✅ CORRECT cleanup - only remove listeners, don't disconnect socket
            return () => {
                // Remove all event listeners to prevent duplicates
                Object.values(SocketNotificationsEvents).forEach((event) => {
                    socket.off(event)
                })
                socket.off('joined')
                // ❌ DON'T disconnect the socket - it's needed by other components!
            }
        }
    }, [
        socket,
        notification,
        setEventListener,
        dispatch,
        handleNotificationClick,
        invalidateCacheForEvent,
    ])

    return children
}
