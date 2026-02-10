import { OutsideClickHandler, Typography } from '@components'
import { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { TiTimes } from 'react-icons/ti'

import { CustomDropdownPositionEnum } from './dropdown.enum'

export const CustomDropdown = ({
    data,
    title,
    value,
    text,
    options,
    onClear,
    width,
    position,
    textColor,
}: {
    position?: CustomDropdownPositionEnum
    data?: any
    textColor?: string
    text: string
    onClear?: (e: any) => void
    title?: string
    value?: any
    options: {
        onClick: (val: any) => void
        color?: string
        text: string
    }[]
    width?: string
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [selectedData, setSelectedData] = useState<any>(null)

    useEffect(() => {
        if (value) {
            setSelectedData(value)
        }
    }, [value])

    return (
        <div className="x-3.5 flex flex-col gap-y-2">
            {title ? (
                <Typography variant="xs" medium>
                    {title}:
                </Typography>
            ) : null}
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
                        className={`cursor-pointer border border-secondary-dark rounded-md flex items-center gap-x-2 justify-between px-2 py-2.5 bg-gray-100 ${width ? width : 'w-60'
                            }`}
                    >
                        <Typography
                            variant="xxs"
                            medium
                            {...(textColor ? { color: textColor } : {})}
                        >
                            {text}
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
                        className={`absolute ${position === CustomDropdownPositionEnum.bottom
                            ? 'bottom-full'
                            : position === CustomDropdownPositionEnum.top
                                ? 'top-full'
                                : 'top-full'
                            }  left-0 w-full shadow-md transition-all duration-500 bg-white overflow-auto custom-scrollbar ${isOpened ? 'max-h-52' : 'max-h-0'
                            }`}
                    >
                        <div
                            onClick={() => {
                                setIsOpened(false)
                            }}
                        >
                            {options?.map((option: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        option.onClick(data)
                                        setSelectedData(option)
                                    }}
                                    className={`${false ? 'bg-gray-200' : ''
                                        } hover:bg-gray-200 py-2 border-b border-secondary-dark px-2 cursor-pointer`}
                                >
                                    <Typography
                                        variant="small"
                                        {...(option?.color
                                            ? { color: option?.color }
                                            : {})}
                                    >
                                        {option?.text}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </OutsideClickHandler>
        </div>
    )
}
