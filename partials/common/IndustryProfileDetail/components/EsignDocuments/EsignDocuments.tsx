import {
    LoadingAnimation,
    NoData,
    Select,
    SelectOption,
    Typography,
} from '@components'
import { IndustryApi, CommonApi } from '@queries'
import React, { useMemo, useState } from 'react'
import { IoMdDocument } from 'react-icons/io'
import { EsignDocumentCard } from './Card'
import { removeEmptyValues } from '@utils'

export const EsignDocuments = ({
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
    const getPendingEsign = CommonApi.ESign.getIndustryEsignDocs(
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
        <div>
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

            {/*  */}
            <div className="mt-2 overflow-auto custom-scrollbar min-h-0 flex-1">
                {getPendingEsign?.isError ? (
                    <NoData isError text="There is some Technical issue!" />
                ) : null}
                {getPendingEsign?.isLoading || getPendingEsign?.isFetching ? (
                    <LoadingAnimation />
                ) : getPendingEsign?.data?.data &&
                  getPendingEsign?.data?.data?.length > 0 &&
                  getPendingEsign?.isSuccess ? (
                    <div className="grid grid-cols-6 gap-3 flex-wrap">
                        {getPendingEsign?.data?.data?.map((document: any) => (
                            <EsignDocumentCard
                                key={document?.id}
                                document={document}
                            />
                        ))}
                    </div>
                ) : getPendingEsign?.isSuccess ? (
                    <NoData text="There is no esign found for this sector!" />
                ) : null}
            </div>
        </div>
    )
}
