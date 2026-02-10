import React, { useState } from 'react'


// Icons
import { MdKeyboardArrowDown } from 'react-icons/md'

// components
import { Typography, LoadingAnimation, OutsideClickHandler } from '@components'

export const ActionDropDown = ({ text, dropDown, loading, lastIndex }: any) => {
    const [expanded, setExpanded] = useState(false) // expanded

    return (
        <div className="relative flex justify-center items-center w-fit px-4 py-2 bg-white rounded-lg border border-secondary shadow">
            {/* Dropdown */}
            <OutsideClickHandler
                onOutsideClick={() => {
                    setExpanded(false)
                }}
            >
                <div>
                    <div
                        onClick={() => setExpanded(!expanded)}
                        className="w-full h-full flex justify-between items-center cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-full h-full z-10 bg-[#ffffff70]">
                                <LoadingAnimation size={25} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-1">
                                <Typography variant={'muted'} color={'black'}>
                                    <span className="font-semibold capitalize whitespace-pre">
                                        {text || 'More'}
                                    </span>
                                </Typography>
                                <MdKeyboardArrowDown className="text-xl" />
                            </div>
                        )}
                    </div>

                    {expanded && (
                        <div
                            className={`w-40 px-2 absolute ${lastIndex ? 'bottom-full mb-2' : 'top-full mt-2'
                                }  right-0 z-10  bg-white rounded-lg border border-secondary shadow-2`}
                        >
                            {dropDown.map(
                                ({ text, Icon, action, color }: any) => (
                                    <div
                                        key={text}
                                        onClick={() => {
                                            setExpanded(false)
                                            action && action()
                                        }}
                                        className={`flex items-center gap-x-2 border-b py-2 cursor-pointer `}
                                        style={{ color }}
                                    >
                                        {Icon && (
                                            <div
                                                className={`cursor-pointer border-2 rounded-full p-0.5`}
                                                style={{
                                                    borderColor: color,
                                                }}
                                            >
                                                <Icon className="text-sm" />
                                            </div>
                                        )}
                                        <Typography
                                            variant={'muted'}
                                            color={'black'}
                                        >
                                            <span className="font-semibold">
                                                {text}
                                            </span>
                                        </Typography>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </OutsideClickHandler>
        </div>
    )
}
