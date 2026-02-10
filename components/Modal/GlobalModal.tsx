import React, { ReactNode } from 'react'
import { Portal } from '@components/Portal'

import { MdCancel } from 'react-icons/md'
import { OutsideClickHandler } from '@components/OutsideClickHandler'

export const GlobalModal = ({
    children,
    className,
    onCancel,
}: {
    className?: string
    children: ReactNode
    onCancel?: () => void
}) => {
    return (
        <Portal>
            <div className="bg-[#00000050] w-full h-screen  flex items-center justify-center fixed top-0 left-0 px-2 z-99999">
                <OutsideClickHandler
                    onOutsideClick={(e: any) => {
                        const target = e.target as HTMLElement
                        if (
                            target.closest('.modal-animation') ||
                            target.closest('.pac-container')
                        )
                            return
                        e.stopPropagation()
                        onCancel && onCancel()
                    }}
                >
                    <div
                        className={`relative bg-white rounded-2xl modal-animation flex flex-col justify-between shadow-md md:w-auto md:min-w-[450px] ${className}`}
                        style={{ zIndex: 99999, position: 'relative' }}
                    >
                        {onCancel && (
                            <MdCancel
                                onClick={onCancel}
                                className="transition-all absolute top-2 right-2 duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                            />
                        )}
                        {children}
                    </div>
                </OutsideClickHandler>
            </div>
        </Portal>
    )
}
