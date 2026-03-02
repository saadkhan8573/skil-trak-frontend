import moment from 'moment'

// Icons
import { RiBook2Fill } from 'react-icons/ri'

// components
import {
    ActionButton,
    Button,
    Card,
    InitialAvatar,
    ShowErrorNotifications,
    Typography,
} from '@components'

// utils
import { WorkplaceCurrentStatus, getUserCredentials } from '@utils'

// query
import {
    useCancelWorkplaceStatusMutation,
    useGetWorkplaceFoldersQuery,
} from '@queries'
import { ReactElement, useEffect, useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import {
    AssignToMe,
    Notes,
    StudentDetail,
    WPStatusForCancelButon,
} from '../components'
import { Industries } from './Industries'
import { RequestType } from './RequestType'
import { RequestTypeAbn } from './RequestTypeAbn'
import Link from 'next/link'
import { UserRoles } from '@constants'
import { BsDot } from 'react-icons/bs'
import { ViewAgreement } from '@partials/common'
import { useContextBar } from '@hooks'
import { CancelWorkplaceModal } from '@partials/common/StudentProfileDetail/components'

export const WorkplaceRequest = ({
    workplace,
}: {
    workplace: IWorkplaceIndustries
}) => {
    const [appliedIndustry, setAppliedIndustry] = useState<any | null>(null)
    const [course, setCourse] = useState<any | null>(null)
    const [folders, setFolders] = useState<any | null>(null)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // query
    const [cancelWorkplace, cancelWorkplaceResult] =
        useCancelWorkplaceStatusMutation()
    // query
    const workplaceFolders = useGetWorkplaceFoldersQuery(
        {
            workplaceId: Number(workplace?.id),
            appliedIndustryId: appliedIndustry?.industry?.id,
            courseId: course?.id,
        },
        { skip: !workplace || !appliedIndustry || !course }
    )

    const { setContent, show } = useContextBar()

    useEffect(() => {
        setAppliedIndustry(
            workplace?.industries?.find(
                (i: WorkplaceWorkIndustriesType) => i.applied
            )
        )
        setCourse(workplace?.courses ? workplace?.courses[0] : {})
    }, [workplace])

    useEffect(() => {
        const getFolders = () => {
            const uploadedFolders = {}
            workplaceFolders?.data?.uploaded?.forEach((folder: any) => {
                if ((uploadedFolders as any)[folder.name]) {
                    ;(uploadedFolders as any)[folder.name].push(folder)
                } else {
                    ;(uploadedFolders as any)[folder.name] = []
                    ;(uploadedFolders as any)[folder.name].push(folder)
                }
            })
            const allFolders = workplaceFolders?.data?.folders?.map(
                (folder: any) => ({
                    ...folder,
                    uploaded: (uploadedFolders as any)[folder?.folder?.name],
                })
            )
            setFolders(allFolders)
        }
        getFolders()
    }, [workplaceFolders])

    const role = getUserCredentials()?.role

    const onCancelWorkplaceClicked = () => {
        setModal(
            <CancelWorkplaceModal
                onCancel={() => {
                    setModal(null)
                }}
                workplaceId={Number(workplace?.id)}
            />
        )
    }

    return (
        <>
            {modal}
            <Card noPadding>
                <ShowErrorNotifications result={cancelWorkplaceResult} />
                <div
                    className={`w-full transition-all duration-700 overflow-hidden p-4 rounded-md shadow-lg ${
                        appliedIndustry?.isCompleted ? 'bg-gray-50' : ''
                    } ${
                        isOpen ? 'max-h-[1000px]' : 'max-h-[350px]'
                    } bg-gray-100`}
                >
                    <div>
                        <div className="flex justify-between items-center flex-wrap gap-5 pb-2.5 border-b border-dashed">
                            <AssignToMe
                                workplace={workplace}
                                appliedIndustry={appliedIndustry}
                            />

                            <div className="flex items-center relative">
                                <div className="flex items-center gap-x-2">
                                    {workplace?.student?.rto?.user?.name && (
                                        <InitialAvatar
                                            name={
                                                workplace?.student?.rto?.user
                                                    ?.name as string
                                            }
                                            imageUrl={
                                                workplace?.student?.rto?.user
                                                    ?.avatar
                                            }
                                        />
                                    )}
                                    <div>
                                        <Typography
                                            color={'black'}
                                            variant={'small'}
                                        >
                                            {
                                                workplace?.student?.rto?.user
                                                    ?.name
                                            }
                                        </Typography>
                                        <div className="flex items-center gap-x-2">
                                            <Typography
                                                variant={'muted'}
                                                color={'text-gray-400'}
                                            >
                                                {
                                                    workplace?.student?.rto
                                                        ?.user?.email
                                                }
                                            </Typography>
                                            <span className="text-gray-400">
                                                |
                                            </span>
                                            <Typography
                                                variant={'muted'}
                                                color={'text-gray-400'}
                                            >
                                                {workplace?.student?.rto?.phone}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  */}
                            <div className="flex items-center relative">
                                <div className="flex items-center gap-x-2">
                                    <RiBook2Fill className="text-gray-400 text-2xl" />
                                    <div>
                                        <Typography
                                            color={'black'}
                                            variant={'xs'}
                                        >
                                            {course?.sector?.name}
                                        </Typography>
                                        <Typography variant={'muted'}>
                                            {course?.code} - {course?.title}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Request Type Selection */}

                            {/* Request Type Selection */}
                            <div className="flex items-center justify-end gap-x-2">
                                {appliedIndustry?.AgreementSigned && (
                                    <Button
                                        variant={'info'}
                                        text={'View Agreement'}
                                        onClick={() => {
                                            setContent(
                                                <ViewAgreement
                                                    workplace={workplace}
                                                />
                                            )
                                            show(false)
                                        }}
                                    />
                                )}
                                {workplace?.studentProvidedWorkplace ? (
                                    <RequestType
                                        appliedIndustry={appliedIndustry}
                                        workplace={workplace}
                                        isOpen={isOpen}
                                    />
                                ) : workplace?.byExistingAbn ? (
                                    <RequestTypeAbn
                                        appliedIndustry={appliedIndustry}
                                        workplace={workplace}
                                        isOpen={isOpen}
                                    />
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-end ml-auto">
                            <ActionButton
                                variant="info"
                                simple
                                Icon={
                                    isOpen
                                        ? MdKeyboardArrowUp
                                        : MdKeyboardArrowDown
                                }
                                onClick={() => {
                                    setIsOpen(!isOpen)
                                    if (isOpened) {
                                        setTimeout(() => {
                                            setIsOpened(!isOpened)
                                        }, 480)
                                    } else {
                                        setIsOpened(!isOpened)
                                    }
                                }}
                            >
                                {isOpened ? 'Show Less' : 'Show More'}
                            </ActionButton>
                        </div>
                    </div>

                    {/* Student Small Details */}
                    <div
                        className={`mt-3  items-center ${
                            isOpen
                                ? 'flex justify-between'
                                : 'grid grid-cols-2 gap-y-3'
                        }`}
                    >
                        <StudentDetail data={workplace?.student} />

                        {!isOpen && (
                            <div>
                                {appliedIndustry ? (
                                    <>
                                        <Typography variant={'label'}>
                                            Work Industry
                                        </Typography>
                                        <Link
                                            href={
                                                role === UserRoles.ADMIN
                                                    ? `/portals/admin/industry/${appliedIndustry?.industry?.id}?tab=sectors`
                                                    : role ===
                                                        UserRoles.SUBADMIN
                                                      ? `/portals/sub-admin/users/industries/${appliedIndustry?.industry?.id}?tab=overview`
                                                      : '#'
                                            }
                                            className="flex items-center gap-x-2 cursor-pointer bg-gray-100 py-1 px-2 rounded-md"
                                        >
                                            {appliedIndustry?.industry?.user
                                                ?.name && (
                                                <InitialAvatar
                                                    name={
                                                        appliedIndustry
                                                            ?.industry?.user
                                                            ?.name
                                                    }
                                                    imageUrl={
                                                        appliedIndustry
                                                            ?.industry?.user
                                                            ?.avatar
                                                    }
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-x-0.5">
                                                    <Typography
                                                        variant={'label'}
                                                    >
                                                        <span className="cursor-pointer">
                                                            {
                                                                appliedIndustry
                                                                    ?.industry
                                                                    ?.user?.name
                                                            }
                                                        </span>
                                                    </Typography>
                                                    <BsDot />
                                                    <Typography
                                                        variant={'xs'}
                                                        color={'text-gray-500'}
                                                    >
                                                        {Number(
                                                            appliedIndustry?.distance
                                                        )?.toFixed(2)}{' '}
                                                        Km Away
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    variant={'muted'}
                                                    color={'gray'}
                                                >
                                                    {
                                                        appliedIndustry
                                                            ?.industry
                                                            ?.addressLine1
                                                    }
                                                    ,{' '}
                                                    {
                                                        appliedIndustry
                                                            ?.industry
                                                            ?.addressLine2
                                                    }
                                                </Typography>
                                            </div>
                                        </Link>
                                    </>
                                ) : null}
                            </div>
                        )}

                        {/*  */}
                        <div className="ml-auto">
                            <Typography variant={'xs'}>Recieved On:</Typography>
                            <Typography variant={'small'}>
                                <span className="font-semibold">
                                    {moment(
                                        workplace?.createdAt,
                                        'YYYY-MM-DD hh:mm:ss Z'
                                    ).format('Do MMM, YYYY')}
                                </span>
                            </Typography>
                        </div>
                    </div>

                    {/* Industries and notes */}
                    {isOpened && (
                        <div className="grid grid-cols-2 gap-x-3 mt-4">
                            {/* Industries */}
                            <div>
                                <Industries
                                    appliedIndustry={appliedIndustry}
                                    industries={
                                        workplace?.industries as WorkplaceWorkIndustriesType[]
                                    }
                                    workplaceId={Number(workplace?.id)}
                                    workplace={workplace}
                                    courseId={course?.id}
                                    folders={folders}
                                />

                                {WPStatusForCancelButon.includes(
                                    workplace?.currentStatus as WorkplaceCurrentStatus
                                ) && (
                                    <div className="mt-3">
                                        <ActionButton
                                            variant={'error'}
                                            onClick={() => {
                                                onCancelWorkplaceClicked()
                                            }}
                                            loading={
                                                cancelWorkplaceResult.isLoading
                                            }
                                            disabled={
                                                cancelWorkplaceResult.isLoading
                                            }
                                        >
                                            Cancel Request
                                        </ActionButton>
                                    </div>
                                )}

                                {/* {!appliedIndustry?.cancelled &&
                            appliedIndustry?.industryResponse !== 'rejected' &&
                            !appliedIndustry?.isCompleted &&
                            !appliedIndustry?.terminated && (
                                
                            )} */}
                            </div>

                            {/* Notes */}
                            <Notes workplace={workplace} />
                        </div>
                    )}
                </div>
            </Card>
        </>
    )
}
