import { useState, useRef, useEffect, ReactNode } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { createPopper } from '@popperjs/core'
import { IconType } from 'react-icons'
import { PermissionType } from '@types'
import { usePermissionCheck } from '@components/Permissions/hooks'

export interface TableActionOption<T> {
    text?: string | React.ReactElement
    onClick?: (rowItem: T) => void
    Icon?: React.ElementType
    color?: string
    hidden?: boolean | ((rowItem: T) => boolean)
    permissions?: PermissionType[]
}

interface TableActionProps<Type> {
    text?: string
    options: (TableActionOption<Type> | {})[]
    rowItem: any
    lastIndex?: boolean
    onlyIcon?: boolean
    Icon?: IconType
    children?: ReactNode
}

export const TableAction = <Type,>({
    text,
    options,
    rowItem,
    lastIndex,
    onlyIcon,
    Icon,
    children,
}: TableActionProps<Type>) => {
    const [showPopper, setShowPopper] = useState(false)
    const buttonRef: any = useRef<HTMLButtonElement>(null)
    const popperRef = useRef<HTMLUListElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { checkPermission } = usePermissionCheck({})

    useEffect(() => {
        if (buttonRef.current && popperRef.current) {
            const popper = createPopper(buttonRef.current, popperRef.current, {
                placement: 'bottom-end',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                        },
                    },
                ],
            })

            return () => {
                popper.destroy()
            }
        }
    }, [showPopper])

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setShowPopper(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowPopper(false)
        }, 100)
    }

    const validOptions = options.filter(
        (option): option is TableActionOption<Type> => {
            if (Object.keys(option).length === 0) return false
            const opt = option as TableActionOption<Type>

            if (opt.permissions && opt.permissions.length > 0) {
                if (!checkPermission(opt.permissions)) return false
            }

            if (typeof opt.hidden === 'function') {
                return !opt.hidden(rowItem)
            }
            return !opt.hidden
        }
    )

    if (validOptions.length === 0 && !children) {
        return null
    }

    return (
        <div className="relative w-fit" onMouseLeave={handleMouseLeave}>
            {children ? (
                <div ref={buttonRef} onMouseEnter={handleMouseEnter}>
                    {children}
                </div>
            ) : (
                <button
                    ref={buttonRef}
                    className="text-xs rounded px-4 py-2 uppercase font-medium bg-white hover:bg-gray-100 text-gray-800 flex gap-x-2 items-center"
                    onMouseEnter={handleMouseEnter}
                >
                    {text || 'More'}
                    <FaChevronDown />
                </button>
            )}

            {showPopper && validOptions.length > 0 && (
                <ul
                    ref={popperRef}
                    className="bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[130px] max-w-[175px]"
                    onMouseEnter={handleMouseEnter}
                >
                    {validOptions.map((option, idx) => (
                        <li
                            key={idx}
                            className={`${
                                option?.color
                                    ? option?.color
                                    : 'text-gray-700 hover:bg-gray-100'
                            } text-xs cursor-pointer px-4 py-2 font-medium border-b whitespace-nowrap ${
                                idx === 0 ? 'rounded-t-xl' : ''
                            } ${
                                idx === validOptions.length - 1
                                    ? 'rounded-b-xl border-none'
                                    : ''
                            } flex items-center gap-x-1`}
                            onClick={() => {
                                setShowPopper(false)
                                if (option?.onClick) {
                                    option?.onClick(rowItem)
                                }
                            }}
                        >
                            {option?.Icon && (
                                <span
                                    className={`${
                                        option?.color
                                            ? option?.color
                                            : 'text-gray-400'
                                    }`}
                                >
                                    <option.Icon />
                                </span>
                            )}
                            <div
                                className="break-all relative group"
                                style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {option?.text}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
