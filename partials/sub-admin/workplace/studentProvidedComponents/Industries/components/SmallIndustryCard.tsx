import { Typography } from '@components/Typography'
import { BsDot } from 'react-icons/bs'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'

export const SmallIndustryCard = ({
    industry,
}: {
    industry: WorkplaceWorkIndustriesType
}) => {
    return (
        <div className="w-fit bg-secondary py-1 px-2 rounded-lg flex justify-between items-center gap-x-2">
            <img
                className="w-6 h-6 rounded-full"
                src={`https://picsum.photos/100/100`}
                alt=""
            />
            <div className="flex items-center gap-x-0.5">
                <Typography variant={'label'}>
                    {industry?.industry?.user?.name}
                </Typography>
                <BsDot />
                <Typography variant={'xs'} color={'text-gray-400'}>
                    5km away
                </Typography>
            </div>
        </div>
    )
}
