import Link from 'next/link'
import { Typography } from '@components'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { ellipsisText, getWorkplaceIndustry } from '@utils'

export const IndustryDetail = ({
    workplace,
}: {
    workplace: IWorkplaceIndustries
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
                    </div>
                    <Link
                        href={`/portals/admin/industry/${industry?.id}`}
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
