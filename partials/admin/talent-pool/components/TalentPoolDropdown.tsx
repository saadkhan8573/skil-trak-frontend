import { OutsideClickHandler, Typography } from '@components'
import React, { ReactNode, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'


export const TalentPoolDropdown = ({
    title,
    selected,
    dropDown,
    onClear,
}: {
    onClear?: (e: any) => void
    title: string
    selected: string
    dropDown: () => ReactNode
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false)

    return (
        <div className="flex items-center gap-x-3.5">
            <Typography variant="xs" semibold>
                {title}:
            </Typography>
            <OutsideClickHandler
                onOutsideClick={() => {
                    setIsOpened(false)
                }}
            >
                <div className="relative z-50">
                    <div
                        onClick={() => {
                            setIsOpened(!isOpened)
                        }}
                        className="cursor-pointer border border-secondary-dark rounded-md flex items-center justify-between px-2 py-2.5 w-60"
                    >
                        <Typography variant="xxs" medium>
                            {selected}
                        </Typography>
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
                        className={`absolute top-full left-0 w-full shadow-md transition-all duration-500 bg-white overflow-auto custom-scrollbar ${isOpened ? 'max-h-52' : 'max-h-0'
                            }`}
                    >
                        <div
                            onClick={() => {
                                setIsOpened(false)
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
