import classNames from 'classnames'
import Link from 'next/link'
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react'
import { AdminApi, adminApi } from '@queries'
import { useRouter } from 'next/router'
import { RouteNavLinkCountType } from '@layouts'
import { PulseLoader } from 'react-spinners'

interface NavItemProps {
    link?: string
    Icon?: any
    children: ReactNode
    active?: boolean
    color?: boolean
    onClick?: MouseEventHandler
    count?: RouteNavLinkCountType
}

export const SideBarItem = ({
    link,
    Icon,
    children,
    active,
    color,
    count,
    onClick,
}: NavItemProps) => {
    const [rplItemCount, setRplItemCount] = useState('0')
    const [volunteerItemCount, setVolunteerItemCount] = useState('0')
    const [talentPoolProfilesCount, setTalentPoolProfilesCount] = useState('0')
    const router = useRouter()
    // const [rplCountReset, setRplCountReset] = useState(0)
    // const [volunteerCountReset, setVolunteerCountReset] = useState(0)
    const { data: rplCount } = AdminApi.Rpl.useRplCount()
    const { data: volunteerCount } = AdminApi.Volunteer.useVolunteerCount()
    const { data: talentPoolCount } =
        AdminApi.TalentPool.useTalentProfilesCount()

    const max = 9
    const classes = classNames({
        // Display
        'flex justify-start items-center cursor-pointer relative': true,

        // Text
        'text-xs font-semibold': true,

        // Padding & Margins
        'px-4 py-3 gap-x-2 w-full group': true,

        // Hovers
        'hover:bg-orange-100 hover:text-orange-500': !color,
        'hover:bg-red-100 hover:text-red-500': color,

        // Focus
        'focus:outline-none focus:ring-4': true,

        // Others
        'transition-all duration-300 rounded-lg border-transparent': true,

        // Background
        'bg-orange-200 text-orange-600': active,
        'bg-transparent text-gray-600': !active,
    })

    const iconClasses = classNames({
        'text-gray-400': true,
        // Hover
        'group-hover:text-orange-300': !color,
        'text-orange-400': active,
        'group-hover:text-red-300': color,
        // Transition
        'transition-all duration-300': true,
    })

    useEffect(() => {
        if (rplCount > max) {
            setRplItemCount(`${max}+`)
        } else {
            setRplItemCount(`${rplCount}`)
        }
    }, [rplCount])
    useEffect(() => {
        if (volunteerCount > max) {
            setVolunteerItemCount(`${max}+`)
        } else {
            setVolunteerItemCount(`${volunteerCount}`)
        }
    }, [volunteerCount])
    useEffect(() => {
        if (talentPoolCount > max) {
            setTalentPoolProfilesCount(`${max}+`)
        } else {
            setTalentPoolProfilesCount(`${talentPoolCount}`)
        }
    }, [talentPoolCount])

    return link ? (
        <Link href={link}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <div className={classes}>
                <Icon className={iconClasses} />
                {children}
                {count ? (
                    <span
                        className={`w-5 h-5 flex items-center justify-center text-center ${
                            !count?.loading ? 'bg-error' : ''
                        } text-white absolute top-1 right-2  rounded-full text-xs`}
                    >
                        {count?.loading ? (
                            <PulseLoader size={4} color={'black'} />
                        ) : (
                            count?.text
                        )}
                    </span>
                ) : null}
            </div>
        </Link>
    ) : (
        <div className={classes} onClick={onClick}>
            <Icon className={iconClasses} />
            {children}
        </div>
    );
}
