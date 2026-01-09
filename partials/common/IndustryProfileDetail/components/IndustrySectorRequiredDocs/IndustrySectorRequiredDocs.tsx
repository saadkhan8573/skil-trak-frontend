import { Card, Select, SelectOption, Typography } from '@components'
import { IndustryApi } from '@queries'
import { Industry, Sector } from '@types'
import { useEffect, useMemo, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import { SectorDocuments } from './components'

export const IndustrySectorRequiredDocs = ({
    industry,
}: {
    industry: Industry
}) => {
    const [isViewd, setIsViewd] = useState<boolean>(false)
    const [selectedSector, setSelectedSector] = useState<number | null>(null)

    const { data, isLoading } = IndustryApi.Courses.useGetIndustrySectorsQuery(
        { userId: Number(industry?.user?.id) },
        {
            skip: !isViewd,
        }
    )

    const sectorOptions = useMemo(
        () =>
            data?.map((sector: Sector) => ({
                value: sector?.id,
                label: sector?.name,
            })),
        [data]
    )

    useEffect(() => {
        if (sectorOptions && sectorOptions?.length > 0) {
            setSelectedSector(sectorOptions?.[0]?.value)
        }
    }, [sectorOptions])

    return (
        <div>
            <Waypoint
                onEnter={() => {
                    setIsViewd(true)
                }}
                onLeave={() => {
                    setIsViewd(false)
                }}
            >
                <div>
                    <Card>
                        <div className="px-4 py-3 flex justify-between items-center border-b border-secondary-dark">
                            <Typography semibold>
                                <span className="text-[15px]">
                                    Required Documents
                                </span>
                            </Typography>
                        </div>
                        <Select
                            label={'Select by Sector'}
                            name={'courseId'}
                            showError={false}
                            options={sectorOptions}
                            placeholder={'Select Sector...'}
                            value={sectorOptions?.find(
                                (sector: SelectOption) =>
                                    sector?.value === Number(selectedSector)
                            )}
                            onChange={(e: number) => {
                                setSelectedSector(e)
                            }}
                            loading={isLoading}
                            disabled={isLoading}
                            onlyValue
                        />

                        {/*  */}
                        <SectorDocuments
                            industry={industry}
                            selectedSector={selectedSector}
                        />
                    </Card>
                </div>
            </Waypoint>
        </div>
    )
}
