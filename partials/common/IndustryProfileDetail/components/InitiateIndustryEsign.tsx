import React from 'react'
import {
    Button,
    GlobalModal,
    LoadingAnimation,
    NoData,
    Select,
    SelectOption,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { DocumentView } from '@partials/sub-admin'
import { CommonApi, IndustryApi } from '@queries'
import { useEffect, useMemo, useState } from 'react'
import { removeEmptyValues } from '@utils'

export const InitiateIndustryEsign = ({
    onCancel,
    industryUserId,
}: {
    onCancel: () => void
    industryUserId: number
}) => {
    const [selectedSector, setSelectedSector] = useState<number | null>(null)
    const [selectedEsign, setSelectedEsign] = useState<any>(null)

    const sectors = IndustryApi.Courses.useGetIndustrySectorsQuery(
        { userId: Number(industryUserId) },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const getEsign = CommonApi.ESign.getIndustryEsignList(
        {
            search: `${JSON.stringify(
                removeEmptyValues({
                    sectorId: selectedSector,
                    status: 'approved',
                })
            )
                .replaceAll('{', '')
                .replaceAll('}', '')
                .replaceAll('"', '')
                .trim()}`,
            skip: 0,
            limit: 25,
        },
        { skip: !selectedSector, refetchOnMountOrArgChange: true }
    )
    const [initiate, initiateResult] = CommonApi.ESign.initiateIndustryESign()

    const { notification } = useNotification()

    const sectorOptions = useMemo(
        () =>
            sectors.data?.map((sector: any) => ({
                label: sector?.name,
                value: sector?.id,
            })),
        [sectors]
    )

    useEffect(() => {
        if (sectorOptions && sectorOptions?.length > 0) {
            setSelectedSector(sectorOptions?.[0]?.value)
        }
    }, [sectorOptions])

    useEffect(() => {
        if (getEsign?.data?.data && getEsign?.data?.data?.length > 0) {
            setSelectedEsign(getEsign?.data?.data?.[0])
        }
    }, [getEsign?.data])

    const onInitiateSign = async () => {
        if (!selectedEsign?.id) {
            notification.warning({
                title: 'Template Required',
                description: 'Please select the esign template',
            })
            return
        }

        const res: any = await initiate({
            industryUserId,
            templateId: selectedEsign?.id,
        })
        if (res?.data) {
            notification.success({
                title: 'Esign Initiated',
                description: 'Esign Initiated Successfully',
            })
            onCancel()
        }
    }
    return (
        <div className="h-full flex flex-col w-full ">
            <ShowErrorNotifications result={initiateResult} />
            <div className="grid grid-cols-5 gap-x-2 flex-1 min-h-0 w-full h-full">
                <div
                    className={`${
                        getEsign?.isSuccess &&
                        getEsign?.data?.data &&
                        getEsign?.data?.data?.length > 0
                            ? 'col-span-2'
                            : 'col-span-5'
                    } flex flex-col min-h-0`}
                >
                    <div className="flex-shrink-0">
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
                                setSelectedEsign(null)
                            }}
                            showError={false}
                            onlyValue
                            loading={sectors.isLoading}
                            disabled={sectors.isLoading}
                        />
                    </div>
                    <div className="mt-2 overflow-auto custom-scrollbar min-h-0 flex-1">
                        {getEsign?.isError ? (
                            <NoData
                                isError
                                text="There is some Technical issue!"
                            />
                        ) : null}
                        {getEsign?.isLoading ? (
                            <LoadingAnimation />
                        ) : getEsign?.data?.data &&
                          getEsign?.data?.data?.length > 0 &&
                          getEsign?.isSuccess ? (
                            <div className="flex items-center gap-3 flex-wrap">
                                {getEsign?.data?.data?.map((esign: any) => (
                                    <div
                                        key={esign?.id}
                                        className={`border rounded-md ${
                                            esign?.id === selectedEsign?.id
                                                ? 'bg-gray-200'
                                                : 'bg-gray-100'
                                        } px-3 py-1.5 cursor-pointer`}
                                        onClick={() => {
                                            setSelectedEsign(esign)
                                        }}
                                    >
                                        <Typography
                                            variant="xs"
                                            semibold
                                            color="text-gray-700"
                                        >
                                            {esign?.name}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        ) : getEsign?.isSuccess ? (
                            <NoData text="There is no esign found for this sector!" />
                        ) : null}
                    </div>

                    {/* Action buttons - fixed at bottom */}
                    <div className="flex items-center gap-x-4 mt-5 flex-shrink-0">
                        <Button
                            variant="action"
                            text="Cancel"
                            onClick={onCancel}
                        />
                        <Button
                            text="Initiate"
                            variant="primaryNew"
                            onClick={onInitiateSign}
                            loading={initiateResult?.isLoading}
                            disabled={
                                !selectedEsign || initiateResult?.isLoading
                            }
                        />
                    </div>
                </div>
                {selectedEsign && (
                    <div className="col-span-3 flex flex-col min-h-0 w-full h-full">
                        <div className="flex-1 min-h-0 border-2 rounded-md overflow-hidden w-full ">
                            <div className="h-full overflow-auto custom-scrollbar">
                                <DocumentView file={selectedEsign?.file} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
