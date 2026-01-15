import { Typography } from '@components'
import { IndustryApi, setActiveSector } from '@redux'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { Sector } from '@types'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

const categories = [
    { id: 'community-services', label: 'Community Services', active: true },
    { id: 'cookery', label: 'Cookery', active: false },
    { id: 'it', label: 'Information Technology', active: false },
    { id: 'healthcare', label: 'Healthcare', active: false },
    { id: 'business', label: 'Business Administration', active: false },
]

export function CategoryFilters() {
    const dispatch = useAppDispatch()

    const [activeCategory, setActiveCategory] = useState<number | null>(null)

    const industry = useAppSelector((state) => state.industry.industryDetail)

    const { data, isLoading, isFetching } =
        IndustryApi.Courses.useGetIndustrySectorsQuery(
            { userId: Number(industry?.user?.id) },
            {
                skip: !industry,
            }
        )

    useEffect(() => {
        if (data && data?.length > 0) {
            dispatch(setActiveSector(data?.[0]?.id))
            setActiveCategory(data?.[0]?.id)
        }
    }, [data])

    return (
        <div className="flex items-center gap-2">
            {isLoading ? (
                <Skeleton className="w-20 h-10" />
            ) : (
                <div>
                    <Typography variant={'label'} color={'text-gray-700'}>
                        Filter by Sectors:
                    </Typography>
                    <div className="flex items-center gap-2">
                        {data?.map((category: Sector) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id)
                                    dispatch(setActiveSector(category.id))
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm ${
                                    activeCategory === category.id
                                        ? 'bg-gradient-to-br from-[#044866] to-[#0D5468] text-white shadow-lg border border-[#044866]'
                                        : 'bg-white hover:bg-gradient-to-br hover:from-[#044866] hover:to-[#0D5468] border border-[#E2E8F0] hover:border-[#044866] text-[#64748B] hover:text-white hover:shadow-lg'
                                }`}
                            >
                                {category?.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
