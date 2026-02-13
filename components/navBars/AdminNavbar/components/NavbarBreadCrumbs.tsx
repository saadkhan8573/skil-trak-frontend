import Link from 'next/link'
import { Fragment } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

export const NavbarBreadCrumbs = ({
    links,
    title,
}: {
    links: string[]
    title: string
}) => (
    <div className="flex items-center text-xs font-medium gap-x-2 text-gray-300 overflow-scroll remove-scrollbar">
        <Link href="/" className="text-gray-400">
            DASHBOARD
        </Link>{' '}
        <IoIosArrowForward />{' '}
        {links.map((link, index) => (
            <Fragment key={index}>
                <Link href={`/${links.slice(0, index + 1).join('/')}`}>
                    {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                    }
                    <span className="whitespace-pre block text-gray-400 cursor-pointer">
                        {link.toUpperCase().replace('-', ' ')}
                    </span>
                </Link>{' '}
                <IoIosArrowForward />{' '}
            </Fragment>
        ))}
        <div className="text-blue-400 whitespace-pre">
            {title.toUpperCase()}
        </div>
    </div>
)
