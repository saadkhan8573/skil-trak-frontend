import { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { PiHeadsetBold, PiMicrosoftTeamsLogo } from 'react-icons/pi'

// components
import {
    AdminNavbar,
    ContextBar,
    DisplayAlerts,
    DisplayNotifications,
    ProtectedRoute,
    RedirectRestrictedUsers,
    SideBar,
} from '@components'
import { IconType } from 'react-icons'

import { useRouter } from 'next/router'
import { BiLogoBlogger } from 'react-icons/bi'
import { BsFillTicketDetailedFill } from 'react-icons/bs'
import {
    FaClipboardList,
    FaCode,
    FaFileInvoiceDollar,
    FaFileSignature,
    FaMapMarkedAlt,
    FaUniversity,
    FaUserGraduate,
    FaUsers,
} from 'react-icons/fa'
import { FaCircleQuestion, FaRegNoteSticky } from 'react-icons/fa6'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import { IoMdBriefcase } from 'react-icons/io'
import { LiaCertificateSolid } from 'react-icons/lia'
import {
    MdEmail,
    MdFindInPage,
    MdHistory,
    MdHomeWork,
    MdNotificationsActive,
    MdSpaceDashboard,
    MdSubscriptions,
    MdVolunteerActivism,
} from 'react-icons/md'
import { RiShieldUserFill, RiVoiceRecognitionLine } from 'react-icons/ri'
import { AdminApi, CommonApi, SubAdminApi } from '@queries'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { TbClockCheck, TbEyeSearch } from 'react-icons/tb'
import { ImOffice } from 'react-icons/im'
import { IoDiamond } from 'react-icons/io5'

export type RouteNavLinkCountType = {
    loading: boolean
    text: number
}

export type RouteNavLink = {
    type?: 'title' | 'divider'
    Icon?: IconType | ReactElement | ReactNode
    path?: string
    text?: string
    placement?: 'before' | 'after'
    count?: RouteNavLinkCountType
    visible?: boolean
}

const getBasePath = `/portals/admin`
const getRoutePath = (path: string) => `${getBasePath}${path}`

// Redirect Restricted Urls
const urlsData = {
    canAccessTalentPool: getRoutePath('/talent-pool'),
    canAccessRpl: getRoutePath('/rpl-list'),
    canAccessQueries: getRoutePath('/queries'),
    canAccessRtoProfile: [
        getRoutePath('/rto/[id]'),
        getRoutePath('/rto/[id]/detail'),
    ],
    allowIndustryListing: getRoutePath('/future-industries'),
    canCancelWorkPlaceRequest: getRoutePath('/cancelled-workplace-requests'),
    canAccessBlogs: [getRoutePath('/blogs'), getRoutePath('/blogs/add-blog')],
    canAccessSubadmin: [
        getRoutePath('/sub-admin'),
        getRoutePath('/sub-admin/[id]'),
        getRoutePath('/sub-admin/[id]/detail'),
    ],
}

export const AdminLayout = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const childrenRef = useRef<any>(null)

    const role = getUserCredentials()?.role

    const queriesCount = CommonApi.WorkBased.useWorkBaseAndTraineeCount()
    const rplCount = AdminApi.Rpl.useRplCount()
    const volunteerCount = AdminApi.Volunteer.useVolunteerCount()
    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
        // refetchOnFocus: true,
    })

    const urls = () => {
        let updatedUrl: string[] = []
        if (subadmin?.data && subadmin?.isSuccess) {
            Object.keys(urlsData as any)?.forEach((key: any) => {
                if (!(subadmin?.data as any)?.[key]) {
                    if (Array.isArray((urlsData as any)?.[key])) {
                        updatedUrl.push(...(urlsData as any)?.[key])
                    } else {
                        updatedUrl.push((urlsData as any)?.[key])
                    }
                }
            })
        }
        return updatedUrl
    }

    useEffect(() => {
        const handleRouteChange = () => {
            if (router.pathname.includes('/portals/admin/sub-admin/[id]')) {
                return
            }

            if (childrenRef.current) {
                childrenRef.current.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                })
            }
        }

        // Add event listener for route changes
        router.events.on('routeChangeComplete', handleRouteChange)

        // Remove event listener when component unmounts
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router])
    const checkIsHod = subadmin?.data?.departmentMember?.isHod

    const routesData: RouteNavLink[] = [
        {
            text: 'Dashboard',
            Icon: MdSpaceDashboard,
            path: getRoutePath(''),
        },
        {
            type: 'divider',
        },
        {
            type: 'title',
            text: 'Users',
        },
        {
            text: 'RTOs',
            Icon: FaUniversity,
            path: getRoutePath('/rto?tab=approved'),
        },
        {
            text: 'Students',
            path: getRoutePath('/student?tab=active'),
            Icon: FaUserGraduate,
        },
        {
            text: 'Industries',
            path: getRoutePath('/industry?tab=approved'),
            Icon: IoMdBriefcase,
        },
        {
            text: 'Coordinators',
            path: getRoutePath('/sub-admin?tab=active'),
            Icon: RiShieldUserFill,
            visible: subadmin?.data?.canAccessSubadmin,
        },
        {
            text: 'Departments',
            path: getRoutePath('/departments'),
            Icon: ImOffice,
            visible: checkIsHod,
        },
        {
            type: 'divider',
        },
        {
            type: 'title',
            text: 'Management',
        },
        {
            text: "KPI's",
            path: getRoutePath('/kpis-progress'),
            Icon: TbClockCheck,
            visible: checkIsHod,
        },
        {
            text: 'Teams',
            path: getRoutePath('/teams'),
            Icon: PiMicrosoftTeamsLogo,
            // visible: checkIsHod,
        },
        {
            text: 'Support Tickets',
            path: getRoutePath('/support-tickets?tab=active'),
            Icon: PiMicrosoftTeamsLogo,
            // visible: checkIsHod,
        },
        {
            text: 'Talent Pool',
            path: getRoutePath('/talent-pool?tab=all'),
            Icon: LiaCertificateSolid,
            visible: subadmin?.data?.canAccessTalentPool,
        },
        {
            text: 'Workplace Request',
            path: getRoutePath(
                '/workplaces?tab=all-student-provided-workplace'
            ),
            Icon: MdHomeWork,
        },
        {
            text: 'WP Cancelation Requests',
            path: getRoutePath(
                '/cancelled-workplace-requests?tab=cancelled-workplace-requests'
            ),
            Icon: MdHomeWork,
            visible: subadmin?.data?.canCancelWorkPlaceRequest,
        },
        {
            text: 'Industry Listing',
            path: getRoutePath('/future-industries?tab=all&page=1&pageSize=50'),
            Icon: MdFindInPage,
            visible: subadmin?.data?.allowIndustryListing,
        },
        {
            text: 'Rto Listing',
            path: getRoutePath('/rto-listing?tab=all&page=1&pageSize=50'),
            Icon: MdFindInPage,
            visible: subadmin?.data?.allowIndustryListing,
        },
        {
            text: 'Generate Key',
            path: getRoutePath('/generate-rto-api'),
            Icon: FaCode,
        },
        {
            text: 'Sectors',
            path: getRoutePath('/sectors?tab=sectors&page=1&pageSize=50'),
            Icon: FaClipboardList,
        },
        {
            text: 'Sector Documents',
            path: getRoutePath('/sector-documents'),
            Icon: HiOutlineDocumentText,
        },
        {
            text: 'Countries & States',
            path: getRoutePath('/countries?tab=countries&page=1&pageSize=50'),
            Icon: FaMapMarkedAlt,
        },
        {
            text: 'Appointments',
            path: getRoutePath('/appointment-type'),
            Icon: FaUsers,
        },
        {
            text: 'RPL',
            path: getRoutePath('/rpl-list'),
            Icon: RiVoiceRecognitionLine,
            count: {
                loading: rplCount?.isLoading,
                text: rplCount?.data,
            },
            visible: subadmin?.data?.canAccessRpl,
        },
        {
            text: 'Volunteer Request',
            path: getRoutePath('/volunteer-requests?tab=pending'),
            Icon: MdVolunteerActivism,
            count: {
                loading: volunteerCount?.isLoading,
                text: volunteerCount?.data,
            },
        },
        {
            text: 'Jobs',
            path: getRoutePath('/jobs?tab=active'),
            Icon: IoMdBriefcase,
        },
        {
            text: 'Blogs',
            path: getRoutePath('/blogs?tab=published&page=1&pageSize=50'),
            Icon: BiLogoBlogger,
            visible: subadmin?.data?.canAccessBlogs,
        },
        {
            text: 'Subscribers',
            path: getRoutePath('/subscribers'),
            Icon: MdSubscriptions,
        },
        {
            text: 'Documents',
            path: getRoutePath('/documents'),
            Icon: HiOutlineDocumentText,
        },
        {
            text: 'Insurance Documents',
            path: getRoutePath('/insurance-documents'),
            Icon: HiOutlineDocumentText,
        },
        {
            text: 'E-Sign',
            path: getRoutePath('/e-sign?tab=approved&page=1&pageSize=50'),
            Icon: FaFileSignature,
        },
        {
            text: 'Tickets',
            path: getRoutePath('/tickets?tab=my-open-tickets'),
            Icon: BsFillTicketDetailedFill,
        },
        {
            text: 'Queries',
            path: getRoutePath('/queries?tab=traineeship'),
            Icon: FaCircleQuestion,
            count: {
                loading: queriesCount?.isLoading,
                text: queriesCount?.data,
            },
            visible: subadmin?.data?.canAccessQueries,
        },
        {
            text: 'RTO Enquiry Queue',
            path: getRoutePath('/rto-enquiry-queue'),
            Icon: FaCircleQuestion,
        },
        {
            text: 'Sub-Admin As Admin Activities',
            path: getRoutePath('/sub-admin-as-admin-activities'),
            Icon: MdHistory,
        },
        {
            text: 'Rto Observer',
            path: getRoutePath('/rto-observer'),
            Icon: TbEyeSearch,
        },
        {
            type: 'divider',
        },
        {
            type: 'title',
            text: 'Messages & Notifications',
        },
        {
            text: 'SMS',
            path: getRoutePath('/sms'),
            Icon: MdSubscriptions,
        },
        {
            text: 'Emails',
            path: getRoutePath('/e-mails?tab=all'),
            Icon: MdEmail,
        },
        {
            text: 'Call Management',
            path: getRoutePath('/call-management'),
            Icon: PiHeadsetBold,
        },
        {
            text: 'Notes Templates',
            path: getRoutePath('/note-template?tab=statusCheckLabelNotes'),
            Icon: FaRegNoteSticky,
        },
        {
            text: 'Notifications',
            path: getRoutePath('/all-notifications'),
            Icon: MdNotificationsActive,
        },
        {
            type: 'divider',
        },
        {
            type: 'title',
            text: 'Accounts',
        },
        {
            text: 'Invoices',
            path: getRoutePath('/invoices'),
            Icon: FaFileInvoiceDollar,
        },
    ]

    const routes = routesData?.filter((route) => route?.visible !== false)
    const checkAdmin = role === UserRoles.ADMIN
    useEffect(() => {
        if (
            !checkAdmin &&
            !checkIsHod &&
            (router.pathname === '/portals/admin/departments' ||
                router.pathname === '/portals/admin/departments/[id]')
        ) {
            router.replace('/portals/admin')
        }
    }, [router.pathname])

    return (
        <RedirectRestrictedUsers
            getRoutePath={getBasePath}
            redirectUrls={urls()}
        >
            <ProtectedRoute>
                <div className="flex w-full h-screen overflow-hidden bg-layout">
                    <SideBar portalType={UserRoles.ADMIN} routes={routes} />
                    {/* <div className="flex-grow flex flex-col justify-between"> */}
                    <div className="flex-grow w-[calc(100vh-224px)]  justify-between">
                        <div className="border-b border-gray-200 bg-white">
                            <AdminNavbar />
                        </div>
                        <div className="flex h-full bg-[#F8FAFC]">
                            <div
                                id="main-content-scroll"
                                className={`h-full overflow-scroll remove-scrollbar w-full relative`}
                                ref={childrenRef}
                            >
                                <DisplayAlerts />
                                <DisplayNotifications />
                                {/* <div className="w-full mb-28 py-3">{children}</div> */}
                                <div className="w-full mb-28 py-1">
                                    {children}
                                </div>
                            </div>
                            <ContextBar />
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </RedirectRestrictedUsers>
    )
}
