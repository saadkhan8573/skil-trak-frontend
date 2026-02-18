import Link from 'next/link'


import { Button } from '../Button'

export const NavLink = ({ to, text, asButton = false, external }: any) => {


    const linkClasses = ` 
    text-gray-300
    py-2
    mx-3
    text-sm
    uppercase
    font-medium
    relative
    transition
    duration-300
    ease-in-out
    hover:text-amber-500
  `

    const getLink = () => {
        if (asButton) {
            return (
                <Button
                    asLink={!external}
                    to={to}
                    text={text}
                    external={external}
                />
            )
        } else if (external) {
            return (
                <a href={to} className={linkClasses}>
                    {text}
                </a>
            )
        } else {
            return (
                <Link href={to} className={linkClasses}>
                    {text}
                </Link>
            )
        }
    }
    return getLink()
}
