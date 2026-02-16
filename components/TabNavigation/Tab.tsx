import classNames from 'classnames'

import Link from 'next/link'
import { ReactElement, ReactNode } from 'react'
import { BounceLoader, PuffLoader, PulseLoader } from 'react-spinners'

interface TabBadge {
    text: string | number | undefined
    color?: string
    loading?: boolean
}

interface Href {
    pathname?: string
    query: any
}

export interface TabProps {
    label: string
    href: Href
    badge?: TabBadge
    active?: boolean
    element: ReactElement | ReactNode
}

const formattedCount = (count: number) => {
    return count < 10 ? `0${count}` : count
}

export const Tab = ({ label, href, badge, active, element }: TabProps) => {
    const classes = classNames({
        'text-xs 2xl:text-sm font-semibold p-4 border-b transition-all duration-500 hover:text-gray-600':
            true,
        'flex items-center flex-shrink-0': true,
        'text-gray-400 border-transparent': !active,
        'text-gray-800 border-orange-500': active,
    })

    const badgeClasses = classNames({
        'px-0.5 text-[11px] ml-2 font-medium min-w-[28px] h-full flex items-center justify-center rounded transition-all duration-500':
            true,
        'bg-gray-300 text-gray-400': !active && Number(badge?.text) === 0,
        'bg-indigo-300 text-indigo-700': !active && Number(badge?.text) !== 0,
        'bg-indigo-500 text-white': active,
    })

    return (
        <div className={classes}>
            <Link href={href}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                {label}
            </Link>
            {badge && (
                <>
                    {badge?.loading && (
                        <span className={badgeClasses}>
                            <PulseLoader size={3} color={'#ffffff'} />
                        </span>
                    )}
                    {badge.text !== undefined && (
                        <span className={badgeClasses}>
                            {formattedCount(Number(badge?.text))}
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
