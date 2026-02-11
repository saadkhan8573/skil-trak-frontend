import { OutsideClickHandler, Typography } from '@components'
import React, { ReactNode, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

import { PulseLoader } from 'react-spinners'

export const StudentNotesDropdown = ({
    title,
    selected,
    dropDown,
    onClear,
    loading,
    disabled,
}: {
    loading?: boolean
    disabled?: boolean
    onClear?: (e: any) => void
    title: string
    selected: string
    dropDown: () => ReactNode
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false)

    return (
        <div className="flex flex-col gap-y-1 gap-x-3.5 w-full">
            <Typography variant="xs" semibold>
                {title}:
            </Typography>
            <OutsideClickHandler
                onOutsideClick={() => {
                    setIsOpened(false)
                }}
            >
                <div className="relative z-48 w-full">
                    <div
                        onClick={() => {
                            setIsOpened(!isOpened)
                        }}
                        className={`${disabled ? 'bg-gray-300' : ''
                            } w-full cursor-pointer border border-secondary-dark rounded-md flex items-center justify-between px-2 py-2.5`}
                    >
                        <div className="flex justify-between items-center w-full">
                            <Typography
                                variant="xxs"
                                color={!selected ? 'text-gray-400' : ''}
                                medium
                            >
                                {selected || 'Select Note Template'}
                            </Typography>
                            {loading && <PulseLoader size={6} />}
                        </div>
                        <div className="flex items-center gap-x-1">
                            {onClear ? (
                                <TiTimes
                                    onClick={(e: any) => {
                                        onClear(e)
                                    }}
                                />
                            ) : null}
                            <MdKeyboardArrowDown />
                        </div>
                    </div>
                    <div
                        className={`absolute top-full left-0 w-full shadow-md transition-all duration-500 bg-white overflow-auto custom-scrollbar ${isOpened && !disabled ? 'max-h-52' : 'max-h-0'
                            }`}
                    >
                        <div
                            onClick={() => {
                                if (!disabled) {
                                    setIsOpened(false)
                                }
                            }}
                        >
                            {dropDown()}
                        </div>
                    </div>
                </div>
            </OutsideClickHandler>
        </div>
    )
}
