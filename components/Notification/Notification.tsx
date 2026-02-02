import { useEffect, useRef, useState } from 'react'

// Icons
import { MdCancel } from 'react-icons/md'

// components
import { Typography } from '../Typography'

// contexts
import { useNotification } from '@hooks'

import { theme } from './theme'
import { NotificationPosition } from './notification.enum'

export const NotificationType = {
    default: 'default',
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
    message: 'message',
}

export const VariantOptions = [
    'default',
    'success',
    'info',
    'warning',
    'error',
    'message',
] as const

interface SubAction {
    text: string
    onClick: Function
}

export const NotificationPositionOptions = [
    'topleft',
    'bottomleft',
    'topright',
    'bottomright',
    'centerright',
] as const

export interface NotificationProps {
    id?: number
    title: string
    description: string
    primaryAction?: SubAction
    secondaryAction?: SubAction
    autoDismiss?: boolean
    variant?: (typeof VariantOptions)[number]
    icon?: any
    avatar?: string
    dissmissTimer?: number
    uniqueId?: number
    position?: (typeof NotificationPositionOptions)[number]
}

export const Notification = ({
    id,
    icon,
    title,
    avatar,
    description,
    dissmissTimer,
    primaryAction,
    secondaryAction,
    autoDismiss = true,
    variant = VariantOptions[0],
}: NotificationProps) => {
    const { dismiss } = useNotification()

    const dismissRef = useRef(dismiss)
    dismissRef.current = dismiss

    const [dismissing, setDismissing] = useState(false)
    const dismissingRef = useRef(dismissing)
    dismissingRef.current = dismissing

    const [hovered, setHovered] = useState(false)

    const Icon = icon || (theme as any)[variant].icon.element
    useEffect(() => {
        if (autoDismiss && !hovered) {
            const timer = setTimeout(() => {
                setDismissing(!dismissingRef.current)
            }, dissmissTimer || 5000)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [autoDismiss, hovered])

    useEffect(() => {
        if (dismissing) {
            const timer = setTimeout(() => {
                if (id) dismissRef.current(id)
            }, 300)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [dismissing])

    const onDismiss = () => {
        setDismissing(true)
    }

    return (
        <div
            className={`${!dismissing ? 'slide-in' : 'slide-out'
                } bg-white w-72 md:w-[365px] min-h-20 md:min-h-24 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden flex relative z-50`}
            style={{ zIndex: 99999 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <MdCancel
                onClick={() => onDismiss()}
                className="absolute top-2 right-2 cursor-pointer text-xl text-gray"
            />

            <div
                className={`px-5 md:px-6 h-[inherit] flex justify-center items-center ${(theme as any)[variant].icon.bg
                    }`}
            >
                {avatar ? (
                    <img
                        className="w-full h-full object-cover"
                        src={avatar}
                        alt="Notification"
                    />
                ) : (
                    Icon && (
                        <Icon
                            className={`${(theme as any)[variant].icon.color
                                } text-xl md:text-3xl`}
                        />
                    )
                )}
            </div>
            <div className="grow p-2">
                <Typography
                    variant={'label'}
                    color={(theme as any)[variant].title}
                >
                    {title}
                </Typography>
                <Typography variant={'muted'}>{description}</Typography>

                <div className="flex justify-between py-2">
                    <div className="flex items-center gap-x-2.5">
                        {primaryAction && (
                            <span
                                className="cursor-pointer"
                                onClick={(e: any) => {
                                    if (primaryAction.onClick) {
                                        primaryAction.onClick(e)
                                        onDismiss()
                                    }
                                }}
                            >
                                <Typography
                                    variant={'muted'}
                                    color={'text-blue-500'}
                                >
                                    {primaryAction.text}
                                </Typography>
                            </span>
                        )}

                        {secondaryAction && (
                            <span
                                className="cursor-pointer"
                                onClick={(e: any) => {
                                    if (secondaryAction.onClick) {
                                        secondaryAction.onClick(e)
                                        onDismiss()
                                    }
                                }}
                            >
                                <Typography
                                    variant={'muted'}
                                    color={'text-gray-500'}
                                >
                                    {secondaryAction.text}
                                </Typography>
                            </span>
                        )}
                    </div>
                    <span
                        className="cursor-pointer"
                        onClick={() => onDismiss()}
                    >
                        <Typography variant={'muted'} color={'text-error'}>
                            Dismiss
                        </Typography>
                    </span>
                </div>
            </div>
        </div>
    )
}
