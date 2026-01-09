import { LoadingAnimation, NoData, Select, SelectOption } from '@components'
import { CommonApi, IndustryApi } from '@queries'
import { useMemo, useState } from 'react'

import { InitiatedEsignCard } from './Card'
import { removeEmptyValues } from '@utils'

export const InitiatedEsignList = ({
    industryUserId,
}: {
    industryUserId: number
}) => {
    const [selectedSector, setSelectedSector] = useState<number | null>(null)

    const sectors = IndustryApi.Courses.useGetIndustrySectorsQuery(
        { userId: industryUserId },
        {
            refetchOnMountOrArgChange: true,
        }
    )
    const getPendingEsign = CommonApi.ESign.getIndustryPendingDocs(
        {
            userId: industryUserId,
            search: `${JSON.stringify(
                removeEmptyValues({
                    sectorId: selectedSector,
                })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
        },
        { skip: !industryUserId, refetchOnMountOrArgChange: true }
    )

    const sectorOptions = useMemo(
        () =>
            sectors.data?.map((sector: any) => ({
                label: sector?.name,
                value: sector?.id,
            })),
        [sectors]
    )

    return (
        <div className="">
            <Select
                label={'Search by Sector'}
                name={'sectorId'}
                options={sectorOptions}
                placeholder={'Select Sector...'}
                value={sectorOptions?.find(
                    (sector: SelectOption) =>
                        sector.value === Number(selectedSector)
                )}
                onChange={(e: any) => {
                    setSelectedSector(e)
                }}
                showError={false}
                onlyValue
                loading={sectors.isLoading}
                disabled={sectors.isLoading}
            />

            <div className="mt-2 overflow-auto custom-scrollbar">
                {getPendingEsign?.isError ? (
                    <NoData isError text="There is some Technical issue!" />
                ) : null}
                {getPendingEsign?.isLoading || getPendingEsign?.isFetching ? (
                    <LoadingAnimation />
                ) : getPendingEsign?.data?.data &&
                  getPendingEsign?.data?.data?.length > 0 &&
                  getPendingEsign?.isSuccess ? (
                    <div className="h-96 pb-10 overflow-auto grid grid-cols-2 gap-3">
                        {getPendingEsign?.data?.data?.map((esign: any) => (
                            <InitiatedEsignCard key={esign?.id} esign={esign} />
                        ))}
                    </div>
                ) : getPendingEsign?.isSuccess ? (
                    <NoData text="There is no esign found for this sector!" />
                ) : null}
            </div>
        </div>
    )
}
