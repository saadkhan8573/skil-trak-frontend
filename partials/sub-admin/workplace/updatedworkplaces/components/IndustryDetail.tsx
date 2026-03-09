import { Typography } from '@components'
import { ellipsisText, getWorkplaceIndustry } from '@utils'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'

export const IndustryDetail = ({
    createdAt,
    workplace,
}: {
    workplace: any
    createdAt?: string
}) => {
    const { industry, isAutomated } = getWorkplaceIndustry(workplace)

    return (
        <>
            {industry ? (
                <>
                    {isAutomated && (
                        <div className="bg-success rounded px-1 py-0.5 w-fit mb-0.5">
                            <Typography variant="xs" color="text-white">
                                Auto
                            </Typography>
                        </div>
                    )}
                    <div
                        title={industry?.user?.name}
                        className="bg-white px-3 py-1.5 rounded-md border border-[#128C7E]"
                    >
                        <Typography variant="small" bold>
                            {ellipsisText(industry?.user?.name, 30)}
                        </Typography>
                        <Typography variant="xxs" semibold whiteSpacePre>
                            WP Created At :{' '}
                            {moment(createdAt).format('DD-MMM-YYYY')}
                        </Typography>
                    </div>
                    <Link
                        href={`/portals/sub-admin/users/industries/${industry?.id}?tab=students`}
                        className="text-blue-500 text-xs"
                    >
                        View Details
                    </Link>
                </>
            ) : (
                <Typography variant="small" semibold>
                    N/A
                </Typography>
            )}
        </>
    )
}
