import { Typography } from '@components'
import { WorkplaceInfoCard } from './WorkplaceInfoCard'

export const StudentWorkplaceInfo = ({
    industry,
    direction,
}: {
    direction?: string
    industry: any
}) => {
    const industryBranch = industry?.location
    const industryData = [
        {
            name: 'Name',
            data: industry?.industry?.user?.name
                ? `${industry?.industry?.user?.name} ${industryBranch ? '(Branch)' : ''}`
                : '---',
        },
        {
            name: 'Address',
            data:
                industryBranch?.address ||
                industry?.industry?.addressLine1 ||
                '---',
        },
        {
            name: 'Website',
            data: industry?.industry?.website || '---',
        },
    ]
    return (
        <div className="flex flex-col h-full">
            <Typography variant="label" medium>
                Workplace Information
            </Typography>

            <div className="flex flex-col gap-y-2.5">
                {industryData?.map((industry: any, idx: number) => (
                    <WorkplaceInfoCard key={idx} {...industry} />
                ))}
            </div>
        </div>
    )
}
