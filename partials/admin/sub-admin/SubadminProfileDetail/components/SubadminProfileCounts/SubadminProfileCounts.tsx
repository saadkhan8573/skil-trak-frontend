import { UserRoles } from '@constants'
import { ProfileCountsCard, RtoProfileCountDataType } from '@partials/admin/rto'
import { ViewWorkplaceDetailModal } from '@partials/admin/sub-admin/modals'
import { SubAdminApi } from '@queries'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { CgFileDocument } from 'react-icons/cg'
import { HiOutlineDocumentDuplicate, HiUserCircle } from 'react-icons/hi'
import {
    SiHomeassistantcommunitystore,
    SiSimpleanalytics,
} from 'react-icons/si'

export const SubadminProfileCounts = ({
    subadminId,
    subadminUserId,
    subAdminProfileCount,
    profileDetail,
}: {
    subadminId: number
    subadminUserId?: number
    subAdminProfileCount: any
    profileDetail?: any
}) => {
    const router = useRouter()
    const id = router?.query?.id as string
    const role = getUserCredentials()?.role
    const subAdmin = SubAdminApi.SubAdmin.useProfile()
    const checkIsAdmin = role === UserRoles.SUBADMIN && subAdmin?.data?.isAdmin
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [countsData, setCountsData] = useState<RtoProfileCountDataType[]>([])

    const onCancelModalClicked = () => setModal(null)

    const onViewWorkplaceClicked = () => {
        setModal(<ViewWorkplaceDetailModal onCancel={onCancelModalClicked} />)
    }

    useEffect(() => {
        const prepareCountsData = async () => {
            const updatedData = subAdminProfileCount?.data || {} // Handle potential missing data

            const processedData: RtoProfileCountDataType[] = [
                {
                    title: 'My Student',
                    count: subAdminProfileCount?.data?.myStudents || 0,
                    Icon: HiUserCircle,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : `/portals/sub-admin/department/students`,

                        ...(role === UserRoles.ADMIN || checkIsAdmin
                            ? {
                                  query: {
                                      tab: 'completed-students',
                                      page: 1,
                                      pageSize: 50,
                                      subadminId,
                                      // rtoId: Number(router?.query?.id),
                                      // status: UserStatus.Approved,
                                  },
                              }
                            : {
                                  query: {
                                      tab: 'all-students',
                                      coordinator: router?.query?.id + '',
                                      page: 1,
                                      pageSize: 50,
                                  },
                              }),
                    },
                    background: {
                        from: '#FF7300',
                        to: '#F7910F',
                    },
                },
                {
                    title: 'Industry In Favourite',
                    count: subAdminProfileCount?.data?.favoriteIndustries || 0,
                    Icon: SiHomeassistantcommunitystore,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : `/portals/sub-admin/department/${
                                      router.query.id || ''
                                  }`,

                        ...(role === UserRoles.ADMIN && {
                            query: {
                                tab: 'archive',
                                page: 1,
                                pageSize: 50,
                                // rtoId: Number(router?.query?.id),
                                // status: UserStatus.Archived,
                            },
                        }),
                    },
                    background: {
                        from: '#286788',
                        to: '#103142',
                    },
                },
                {
                    title: 'RTOS',
                    count: subAdminProfileCount?.data?.rto || 0,
                    Icon: HiUserCircle,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : `/portals/sub-admin/department/${
                                      router.query.id || ''
                                  }`,

                        ...((role === UserRoles.ADMIN || checkIsAdmin) && {
                            query: {
                                tab: 'active',
                                page: 1,
                                pageSize: 50,
                                // rtoId: Number(router?.query?.id),
                                // status: UserStatus.Approved,
                            },
                        }),
                    },
                    background: {
                        from: '#6971DD',
                        to: '#454CB0',
                    },
                },
                {
                    title: 'Workplace Request In Process',
                    count: subAdminProfileCount?.data?.inProcess || 0,
                    Icon: SiHomeassistantcommunitystore,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : '#',

                        ...((role === UserRoles.ADMIN || checkIsAdmin) && {
                            query: {
                                tab: 'active',
                                page: 1,
                                pageSize: 50,
                                // rtoId: Number(router?.query?.id),
                                // status: UserStatus.Pending,
                            },
                        }),
                    },
                    background: {
                        from: '#4339F2',
                        to: '#080092',
                    },
                    customDetail: {
                        text: 'View Detail',
                        onClick: (e: any) => {
                            e?.stopPropagation()
                            onViewWorkplaceClicked()
                        },
                    },
                },
                {
                    title: 'Student In Pending',
                    count: subAdminProfileCount?.data?.Pendingstudent || 0,
                    Icon: HiUserCircle,
                    loading: false,
                    background: {
                        from: '#454CB0',
                        to: '#0C1695',
                    },
                },
                {
                    title: 'Upcoming Appointments',
                    count: subAdminProfileCount?.data?.appointment || 0,
                    Icon: SiSimpleanalytics,
                    loading: false,
                    background: {
                        from: '#439DEE',
                        to: '#1E78E9',
                    },
                },
                {
                    title: 'Workplace Started',
                    count: subAdminProfileCount?.data?.placementStarted || 0,
                    Icon: HiUserCircle,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : '#',
                        ...((role === UserRoles.ADMIN || checkIsAdmin) && {
                            query: {
                                tab: 'active',
                                page: 1,
                                pageSize: 50,
                                // rtoId: Number(router?.query?.id),
                                // status: UserStatus.Pending,
                            },
                        }),
                    },
                    background: {
                        from: '#02A0FC',
                        to: '#0070DF',
                    },
                },
                {
                    title: 'Open Tickets',
                    count: subAdminProfileCount?.data?.openTicket || 0,
                    Icon: HiOutlineDocumentDuplicate,
                    loading: false,
                    link: {
                        pathname:
                            role === UserRoles.ADMIN || checkIsAdmin
                                ? '/portals/admin/student'
                                : `/portals/sub-admin/tickets`,
                        ...(role === UserRoles.ADMIN || checkIsAdmin
                            ? {}
                            : {
                                  query: {
                                      tab: 'department-tickets',
                                      page: 1,
                                      pageSize: 50,
                                      subAdminId: Number(subadminUserId),
                                      // rtoId: Number(router?.query?.id),
                                      // status: UserStatus.Pending,
                                  },
                              }),
                        query: {
                            tab: 'department-tickets',
                            subAdminId: profileDetail?.user?.id,
                        },
                    },
                    background: {
                        from: '#6A6A6A',
                        to: '#5A5570',
                    },
                },
                {
                    title: 'Industry Listing',
                    count: subAdminProfileCount?.data?.listing || 0,
                    Icon: CgFileDocument,
                    loading: false,
                    background: {
                        from: '#7E9637',
                        to: '#516D00',
                    },
                    customDetail: {
                        text: 'View Monthly',
                        onClick: function () {
                            setCountsData((prevCountsData) => {
                                const updatedCountsData = prevCountsData.map(
                                    (item) =>
                                        item.customDetail?.text ===
                                        'View Monthly'
                                            ? {
                                                  ...item,
                                                  count:
                                                      subAdminProfileCount?.data
                                                          ?.monthlyListing || 0,
                                                  customDetail: {
                                                      ...item.customDetail,
                                                      text: 'View Daily',
                                                  },
                                              }
                                            : item.customDetail?.text ===
                                                'View Daily'
                                              ? {
                                                    ...item,
                                                    count:
                                                        subAdminProfileCount
                                                            ?.data?.listing ||
                                                        0,
                                                    customDetail: {
                                                        ...item.customDetail,
                                                        text: 'View Monthly',
                                                    },
                                                }
                                              : item
                                )
                                return updatedCountsData
                            })
                        },
                    },
                },
            ]

            setCountsData(processedData)
        }

        prepareCountsData()
    }, [subAdminProfileCount])

    return (
        <>
            {modal}
            <div className="mt-[18px] grid grid-cols-3  h-[calc(100%-18px)] gap-y-8 gap-x-3.5 justify-between">
                {countsData?.map((data) => (
                    <ProfileCountsCard key={data.title} data={data} />
                ))}
            </div>
        </>
    )
}
