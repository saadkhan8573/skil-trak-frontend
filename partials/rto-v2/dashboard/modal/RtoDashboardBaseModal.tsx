import { Badge, GlobalModal, Typography } from '@components'
import classNames from 'classnames'
import { GraduationCap } from 'lucide-react'
import React, { ReactNode } from 'react'
import { MdCancel } from 'react-icons/md'

export const RtoDashboardBaseModal = ({
    onCancel,
    children,
    title,
    description,
    titleBadge,
    icon,
    variant,
}: {
    icon?: any
    variant?: 'primaryNew' | 'primary' | 'success' | 'primaryLight'
    titleBadge?: string
    title: string
    description: string
    children: ReactNode
    onCancel: () => void
}) => {
    const bgClasses = classNames({
        'relative px-6 pt-6 pb-4 bg-primaryNew overflow-hidden': true,
        '!bg-primary': variant === 'primary',
        '!bg-success': variant === 'success',
        '!bg-primary/10': variant === 'primaryLight',
    })

    const Icon = icon || GraduationCap

    return (
        <GlobalModal className="overflow-hidden! max-w-3xl!">
            <MdCancel
                onClick={() => {
                    if (onCancel) {
                        onCancel()
                    }
                }}
                className="z-30 transition-all duration-500 text-gray-200 hover:text-gray-100 text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
            />
            <div className={bgClasses}>
                <div className="relative">
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-premium border border-white/30 shrink-0">
                            <Icon
                                className="h-7 w-7 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Typography className="text-white text-xl">
                                    {title}
                                </Typography>
                                {titleBadge && (
                                    <Badge
                                        text={titleBadge}
                                        className="bg-white/20 text-white border-white/30 backdrop-blur-md text-xs"
                                    />
                                )}
                            </div>
                            <Typography className="text-white/90 text-sm leading-relaxed">
                                {description}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[70vh] overflow-auto custom-scrollbar p-4">
                {children}
            </div>
        </GlobalModal>
    )
}
