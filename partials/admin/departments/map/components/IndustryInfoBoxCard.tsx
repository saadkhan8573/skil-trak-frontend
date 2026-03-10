import { Badge, NoData, ShowErrorNotifications, Typography } from '@components'
import { useContextBar } from '@hooks'
import { ShowIndustryNotesAndTHModal } from '@partials/common/StudentProfileDetail/components'
import { useAddExistingIndustriesMutation } from '@queries'
import { ellipsisText, getSectorsDetail } from '@utils'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { PulseLoader } from 'react-spinners'

import { CopyInfoData } from './CopyInfoData'
import { IndustryDetailCB } from '@partials/common/MapBox/contextBar'

type IndustryInfoBoxCardProps = {
    item: any
    selectedBox: any
    setSelectedBox: any
    industryId?: any
    workplace?: any
    appliedIndustry?: any
    workplaceMapCard?: boolean
    onCancel?: any
}

export const IndustryInfoBoxCard = ({
    item,
    selectedBox,
    setSelectedBox,
    industryId,
    workplace,
    appliedIndustry,
    workplaceMapCard = false,
    onCancel,
}: any) => {
    console.log({ selectedBox })
    const workplaceId = workplace?.id

    const [modal, setModal] = useState<ReactElement | null>(null)

    const contextBar = useContextBar()

    const sectors = getSectorsDetail(selectedBox?.courses)

    const onModalCancelClicked = () => setModal(null)

    const onApplyIndustryModal = () => {
        setModal(
            <ShowIndustryNotesAndTHModal
                industryUserId={item?.data?.user?.id}
                industryUserName={item?.data?.user?.name}
                industryId={selectedBox?.activeBranch?.id || industryId}
                workplaceId={workplaceId}
                onCancel={(cancel?: boolean) => {
                    onModalCancelClicked()
                    if (cancel) {
                        onCancel()
                    }
                }}
                type={selectedBox?.activeBranch?.id && 'branch'}
            />
        )
    }

    const onViewIndustryDetail = () => {
        contextBar.show(false)
        contextBar.setContent(
            <IndustryDetailCB
                id={selectedBox?.id}
                industryUserId={item?.data?.user?.id}
            />
        )
        contextBar.setTitle('Industry Details')
    }

    return (
        <>
            {modal}
            <div className="min-w-80">
                {item.isError && <NoData text="Something is not right...!" />}
                {item?.isLoading ? (
                    <PulseLoader />
                ) : (
                    <>
                        <div className={'flex items-end relative z-50'}>
                            <div className="bg-white mt-2 relative z-50 w-12 rounded-full h-12 border border-gray-400 ml-3 p-1">
                                <Image
                                    src={'/images/icons/avatars/std-boy.png'}
                                    alt={'avatar'}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="relative min-w-72 bg-white px-2.5 py-5 rounded-lg shadow-lg -mt-5">
                            <FaTimes
                                size={18}
                                className="cursor-pointer absolute top-2 right-2"
                                onClick={() => {
                                    setSelectedBox(null)
                                }}
                            />
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-b-8 border-b-white border-x-8 border-x-transparent"></div>

                            <div className="mt-2">
                                <div>
                                    {item?.data?.isSnoozed ? (
                                        <Badge
                                            variant="success"
                                            text="Industry Snoozed"
                                        />
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {!workplaceMapCard ? (
                                    <div className="relative group w-fit">
                                        <Typography variant="title">
                                            {ellipsisText(
                                                item?.data?.user?.name,
                                                15
                                            )}
                                        </Typography>

                                        {/*  */}
                                        <CopyInfoData
                                            text={item?.data?.user?.name}
                                            type={'Name'}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-x-4 border-b pb-2">
                                        <div className="flex flex-col gap-y-1">
                                            <Typography
                                                variant="muted"
                                                color={'text-gray-400'}
                                            >
                                                Industry
                                            </Typography>

                                            <div className="relative group w-fit">
                                                <Typography variant="muted">
                                                    {ellipsisText(
                                                        item?.data?.user?.name,
                                                        15
                                                    )}
                                                </Typography>

                                                {/*  */}
                                                <CopyInfoData
                                                    text={
                                                        item?.data?.user?.name
                                                    }
                                                    type={'Name'}
                                                />
                                            </div>
                                            <div className="relative group w-fit">
                                                <Typography variant="muted">
                                                    {item?.data?.user?.email}
                                                </Typography>

                                                {/*  */}
                                                <CopyInfoData
                                                    text={
                                                        item?.data?.user?.email
                                                    }
                                                    type={'Email'}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-y-1 whitespace-nowrap">
                                            <Typography
                                                variant="muted"
                                                color={'text-gray-400'}
                                            >
                                                Contact Person
                                            </Typography>
                                            <Typography variant="muted">
                                                {ellipsisText(
                                                    item?.data?.contactPerson,
                                                    15
                                                ) ?? 'NA'}
                                            </Typography>

                                            <div className="relative group w-fit">
                                                <Typography variant="xs">
                                                    {item?.data
                                                        ?.contactPersonNumber ??
                                                        'NA'}
                                                </Typography>

                                                {/*  */}
                                                <CopyInfoData
                                                    text={
                                                        item?.data
                                                            ?.contactPersonNumber
                                                    }
                                                    type={
                                                        'Contact Person Number'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/*  */}
                            <div>
                                <Typography
                                    variant="muted"
                                    color={'text-gray-400'}
                                >
                                    Sector
                                </Typography>

                                {sectors?.map((s: any) => (
                                    <div className="border-b border-gray-200 pb-2 mb-2">
                                        {/* <Typography variant="xxs">
                                            {s?.code || 'N/A'}
                                        </Typography> */}
                                        <Typography variant="xs">
                                            {s?.name || 'N/A'}
                                        </Typography>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center gap-x-12">
                                {/* <div className="flex justify-center mt-1.5">
                                    <Link
                                        className="text-blue-400 text-xs"
                                        href={`/portals/sub-admin/users/industries/${item?.data?.id}?tab=students`}
                                    >
                                        View
                                    </Link>
                                </div> */}
                                <div
                                    onClick={() => {
                                        onViewIndustryDetail()
                                    }}
                                >
                                    <Typography
                                        variant="small"
                                        color="text-info"
                                        cursorPointer
                                    >
                                        View
                                    </Typography>
                                </div>

                                {!appliedIndustry && workplaceMapCard && (
                                    // !industry?.applied &&
                                    // industry?.industryResponse !== 'noResponse' &&
                                    // industry?.industryResponse !== 'rejected' &&
                                    <Typography
                                        variant={'xs'}
                                        color={'text-red-800'}
                                        center
                                    >
                                        <span
                                            className="cursor-pointer whitespace-pre"
                                            // onClick={() => {
                                            //     if (!appliedIndustry) {
                                            //         applyForWorkplace({
                                            //             industry:
                                            //                 industryId,
                                            //             id: workplace?.id,
                                            //         })
                                            //     } else {
                                            //         notification.error({
                                            //             title: 'Already Applied',
                                            //             description:
                                            //                 'Already Applied to another Industry',
                                            //         })
                                            //     }
                                            // }}
                                            onClick={() => {
                                                onApplyIndustryModal()
                                                // addExistingIndustry({
                                                //     workplaceId,
                                                //     industryId: industryId,
                                                // })
                                            }}
                                        >
                                            APPLY HERE
                                        </span>
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
