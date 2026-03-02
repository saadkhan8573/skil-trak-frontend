import {
    ActionButton,
    AuthorizedUserComponent,
    InitialAvatar,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useEffect, useState } from 'react'
import { BsDot } from 'react-icons/bs'

// query
import { useNotification } from '@hooks'
import { useSubAdminApplyStudentWorkplaceMutation } from '@queries'
import Link from 'next/link'
import { MdDelete } from 'react-icons/md'
import { PulseLoader } from 'react-spinners'

import { UserRoles } from '@constants'
import { RemoveIndustryModal } from '@partials/sub-admin/workplace/modals'
import { Student } from '@types'
import { getUserCredentials } from '@utils'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const IndustryCard = ({
    industry,
    appliedIndustry,
    workplace,
    applied,
    courseId,
    student,
}: {
    industry: any
    student: Student
    appliedIndustry?: any
    workplace: IWorkplaceIndustries
    applied?: boolean
    courseId: number
}) => {
    const [modal, setModal] = useState<any | null>(null)
    const [applyForWorkplace, applyForWorkplaceResult] =
        useSubAdminApplyStudentWorkplaceMutation()

    // hooks
    const { notification } = useNotification()

    useEffect(() => {
        if (applyForWorkplaceResult.isSuccess) {
            notification.success({
                title: 'Applied to Industry',
                description: 'Applied to Industry Successfully',
            })
        }
    }, [applyForWorkplaceResult])

    const onCancelClicked = () => {
        setModal(null)
    }

    const onDeleteIndustry = (industry: any) => {
        setModal(
            <RemoveIndustryModal
                industry={industry}
                onCancel={onCancelClicked}
                studentId={Number(student?.id)}
            />
        )
    }

    const role = getUserCredentials()?.role

    return (
        <>
            {modal}
            <ShowErrorNotifications result={applyForWorkplaceResult} />
            <div className="bg-[#F7F1E3] rounded-lg py-1 px-3">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                    <Link
                        href={
                            role === UserRoles.ADMIN
                                ? `/portals/admin/industry/${industry?.industry?.id}?tab=sectors`
                                : role === UserRoles.SUBADMIN
                                  ? `/portals/sub-admin/users/industries/${industry?.industry?.id}?tab=overview`
                                  : role === UserRoles.RTO
                                    ? `/portals/rto/industries/workplaces/${industry?.industry?.id}`
                                    : '#'
                        }
                        className="flex items-center gap-x-2 cursor-pointer"
                    >
                        {industry?.industry?.user?.name && (
                            <InitialAvatar
                                name={industry?.industry?.user?.name}
                                imageUrl={industry?.industry?.user?.avatar}
                            />
                        )}
                        <div>
                            <div className="flex items-center gap-x-0.5">
                                <Typography variant={'label'}>
                                    <span className="cursor-pointer">
                                        {industry?.industry?.user?.name}
                                    </span>
                                </Typography>
                                <BsDot />
                                <Typography
                                    variant={'xs'}
                                    color={'text-gray-500'}
                                >
                                    {Number(industry?.distance)?.toFixed(2)} Km
                                    Away
                                </Typography>
                            </div>
                            <Typography variant={'muted'} color={'gray'}>
                                {industry?.location
                                    ? `${industry?.location?.address}`
                                    : `${industry?.industry?.addressLine1}`}
                            </Typography>
                        </div>
                    </Link>
                    <div className="flex items-center gap-x-2 ml-auto">
                        <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                            {applied &&
                                !workplace?.byExistingAbn &&
                                !workplace?.studentProvidedWorkplace && (
                                    <AuthorizedUserComponent
                                        excludeRoles={[UserRoles.OBSERVER]}
                                    >
                                        <div className="flex justify-end gap-x-2 top-0 right-0">
                                            <ActionButton
                                                rounded
                                                Icon={MdDelete}
                                                variant={'error'}
                                                onClick={() =>
                                                    onDeleteIndustry(industry)
                                                }
                                                title="Delete Industry"
                                            />
                                        </div>
                                    </AuthorizedUserComponent>
                                )}
                        </AuthorizedUserComponent>
                        {/* {applied &&
                            !workplace?.byExistingAbn &&
                            !workplace?.studentProvidedWorkplace && (
                                <AuthorizedUserComponent
                                    excludeRoles={[UserRoles.OBSERVER]}
                                >
                                    <div className="flex justify-end gap-x-2 top-0 right-0">
                                        <ActionButton
                                            rounded
                                            Icon={MdDelete}
                                            variant={'error'}
                                            onClick={() =>
                                                onDeleteIndustry(industry)
                                            }
                                            title="Delete Industry"
                                        />
                                    </div>
                                </AuthorizedUserComponent>
                            )} */}
                        {industry?.applied &&
                            industry?.industryResponse !== 'noResponse' &&
                            industry?.industryResponse !== 'rejected' && (
                                <Typography
                                    variant={'xs'}
                                    color={'text-red-800'}
                                    center
                                >
                                    APPLIED
                                </Typography>
                            )}
                        {industry?.industryResponse === 'noResponse' && (
                            <Typography
                                variant={'xs'}
                                color={'text-red-500'}
                                center
                            >
                                No Response
                            </Typography>
                        )}
                        {industry?.industryResponse === 'rejected' && (
                            <Typography
                                variant={'xs'}
                                color={'text-red-500'}
                                center
                            >
                                Rejected
                            </Typography>
                        )}
                        {industry?.applied &&
                            industry?.industryResponse === 'approved' && (
                                <Typography variant={'xs'}>
                                    <span className="bg-success px-2 py-0.5 text-white rounded-full">
                                        Approved
                                    </span>
                                </Typography>
                            )}
                        {!appliedIndustry &&
                            !industry?.applied &&
                            industry?.industryResponse !== 'noResponse' &&
                            industry?.industryResponse !== 'rejected' && (
                                <Typography
                                    variant={'xs'}
                                    color={'text-red-800'}
                                    center
                                >
                                    <span
                                        className="cursor-pointer whitespace-pre"
                                        onClick={() => {
                                            if (!appliedIndustry) {
                                                applyForWorkplace({
                                                    industry: industry?.id,
                                                    id: Number(workplace?.id),
                                                })
                                            } else {
                                                notification.error({
                                                    title: 'Already Applied',
                                                    description:
                                                        'Already Applied to another Industry',
                                                })
                                            }
                                        }}
                                    >
                                        {applyForWorkplaceResult.isLoading ? (
                                            <PulseLoader size={4} />
                                        ) : (
                                            'APPLY HERE'
                                        )}
                                    </span>
                                </Typography>
                            )}
                        {/* {industry.industryResponse !== 'approved' && industry.applied ? (
            <Typography variant={'xs'} color={'text-red-800'} center>
               APPLIED
            </Typography>
         ) : industry.industryResponse &&
           !industry.applied &&
           industry.industryResponse === 'noResponse' ? (
            <Typography variant={'xs'} color={'text-red-500'} center>
               No Response
            </Typography>
         ) : industry.industryResponse === 'approved' ? (
            <Typography variant={'xs'}>
               <span className="bg-success px-2 py-0.5 text-white rounded-full">
                  Approved
               </span>
            </Typography>
         ) : (
            !appliedIndustry && (
               <Typography variant={'xs'} color={'text-red-800'} center>
                  <span
                     className="cursor-pointer"
                     onClick={() => {
                        applyForWorkplace(industry?.id)
                     }}
                  >
                     APPLY HERE
                  </span>
               </Typography>
            )
         )} */}
                    </div>
                </div>
                <div>
                    {/* {industry?.industry?.courses[0]?.folders?.map((folder:any) => (
                        <>{folder?.name}</>
                    ))} */}
                </div>
            </div>
        </>
    )
}
