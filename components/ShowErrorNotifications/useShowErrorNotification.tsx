import {
    NotificationPositionOptions,
    VariantOptions,
} from '@components/Notification'
import { useNotification } from '@hooks'
import React, { useRef } from 'react'

export const useShowErrorNotification = () => {
    const { notification } = useNotification()
    const notificationRef = useRef(notification)
    notificationRef.current = notification

    const showErrorNotifications = async (
        result: any,
        variant?: (typeof VariantOptions)[number],
        position?: (typeof NotificationPositionOptions)[number]
    ) => {
        if (result?.isError) {
            const errorTitle = result.error?.data?.error
            if (errorTitle && Array.isArray(result.error?.data?.message)) {
                for (let msg of result.error?.data?.message) {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    notificationRef.current[variant || 'error']({
                        title: errorTitle,
                        description: msg,
                        autoDismiss: true,
                        dissmissTimer: 5000,
                        position,
                    })
                }
            } else {
                notificationRef.current[variant || 'error']({
                    title: errorTitle || 'Some thing is not right',
                    description:
                        result.error?.data?.message ||
                        'Please check your network connection',
                    autoDismiss: true,
                    dissmissTimer: 5000,
                    position,
                })
            }
        }
    }

    return showErrorNotifications
}
