import Link from 'next/link'
import { MouseEventHandler, ReactNode } from 'react'

interface NavItemProps {
    link?: string
    Icon?: any
    children: ReactNode
    active?: boolean
    color?: string
    onClick?: MouseEventHandler
}

export const NavItem = ({
    link,
    Icon,
    children,
    active,
    color,
    onClick,
}: NavItemProps) => {
    return link ? (
        <Link href={link}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <div
                className={`${
                    active ? 'bg-primary text-white' : 'bg-transparent'
                } text-sm transition-all duration-300 cursor-pointer border-transparent px-4 py-2 focus:outline-none focus:ring-4 hover:bg-secondary hover:text-typography-light rounded-lg flex justify-start items-center`}
            >
                <Icon className="inline-flex mr-2 text-sm" />
                {children}
            </div>
        </Link>
    ) : (
        <div
            className={`${
                active ? 'bg-primary text-white' : 'bg-transparent'
            } text-sm transition-all duration-300 cursor-pointer border-transparent px-4 py-2 focus:outline-none focus:ring-4 hover:bg-secondary hover:text-typography-light rounded-lg flex justify-start items-center`}
            onClick={onClick}
        >
            <Icon className="inline-flex mr-3.5 text-sm" />
            {children}
        </div>
    );
}
