import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

import { Typography } from '@components'
import Link from 'next/link'

interface BreadCrumb {
    text: string
    link: string
    active?: boolean
}

export const AuthBreadCrumb = ({
    breadcrumbs,
}: {
    breadcrumbs: BreadCrumb[]
}) => {
    return (
        <div className="flex items-center gap-x-2 remove-scrollbar overflow-x-scroll">
            {breadcrumbs.map((breadcrumb, i) => (
                <div key={i} className="flex items-center gap-x-2">
                    <Link href={breadcrumb.link}>

                        <Typography
                            variant={'label'}
                            color={
                                breadcrumb.active
                                    ? 'text-primary'
                                    : 'text-muted'
                            }
                            capitalize
                        >
                            <span className="cursor-pointer first-letter:text-orange-900">
                                {breadcrumb.text}
                            </span>
                        </Typography>

                    </Link>
                    {!breadcrumb.active && (
                        <Typography variant={'title'} color={'text-muted'}>
                            <MdOutlineKeyboardArrowRight />
                        </Typography>
                    )}
                </div>
            ))}
        </div>
    );
}
