import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

// hooks
import { useContextBar, useNavbar } from '@hooks'
//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'

//components
import {
    BackButton,
    Button,
    EmptyData,
    LoadingAnimation,
    PageTitle,
    RtoProfileSidebar,
    TechnicalError,
    withPermission,
} from '@components'

// icons
import { FaChevronDown, FaFileImport, FaUserGraduate } from 'react-icons/fa'
// queries
import { DetailTabs } from '@partials/sub-admin/rto/tabs'
import { useGetSubAdminRTODetailQuery } from '@queries'
import { getLink } from '@utils'

type Props = {}

const RtoProfile: NextPageWithLayout = (props: Props) => {
    const pathname = useRouter()
    const { id } = pathname.query
    const { setContent, show, hide } = useContextBar()

    const rtoDetail = useGetSubAdminRTODetailQuery(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const navBar = useNavbar()

    useEffect(() => {
        if (rtoDetail?.isSuccess) {
            setContent(
                <>
                    <RtoProfileSidebar
                        rto={rtoDetail}
                        loading={rtoDetail?.isLoading}
                        data={rtoDetail?.data}
                    />
                </>
            )
            show(false)
        }
        return () => {
            setContent(null)
            hide()
        }
    }, [rtoDetail, setContent])

    useEffect(() => {
        navBar.setSubTitle(rtoDetail?.data?.user?.name)
    }, [rtoDetail])

    const [showDropDown, setShowDropDown] = useState(false)
    return (
        <>
            <div className="flex justify-between items-end mb-4">
                <div>
                    <BackButton
                        text={'RTOs'}
                        link={`${
                            getLink('subadmin-rtos') ||
                            '/portals/sub-admin/users/rtos'
                        }`}
                    />
                    <PageTitle title="RTO Profile" />
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-3">
                        <div
                            className="relative"
                            onMouseEnter={() => {
                                if (rtoDetail.isSuccess) {
                                    setShowDropDown(true)
                                }
                            }}
                            onMouseLeave={() => setShowDropDown(false)}
                        >
                            <Button
                                disabled={
                                    rtoDetail.isLoading || !rtoDetail.isSuccess
                                }
                            >
                                <span
                                    id="add-students"
                                    className="flex items-center gap-x-2"
                                >
                                    <span>Add Students</span>
                                    <FaChevronDown />
                                </span>
                            </Button>

                            {showDropDown ? (
                                <ul className="bg-white shadow-xl rounded-xl overflow-hidden absolute">
                                    <li>
                                        <button
                                            onClick={() => {
                                                pathname.push({
                                                    pathname: `/portals/sub-admin/users/rtos/${rtoDetail?.data?.user?.id}/student-list`,
                                                    query: { rtoId: id },
                                                })
                                            }}
                                            className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                        >
                                            <span className="text-gray-500">
                                                <FaFileImport />
                                            </span>
                                            <span className="whitespace-nowrap">
                                                {' '}
                                                Import Students
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                pathname.push(
                                                    `/portals/sub-admin/users/rtos/${id}/add-individual-student`
                                                )
                                            }}
                                            className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                        >
                                            <span className="text-gray-500">
                                                <FaUserGraduate />
                                            </span>
                                            <span> Add Individual</span>
                                        </button>
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                    </div>
                    <Button
                        text="Book Appointment"
                        variant="info"
                        onClick={() => {
                            pathname.push({
                                pathname:
                                    '/portals/sub-admin/tasks/appointments/create-appointment',
                                query: { rto: rtoDetail?.data?.user?.id },
                            })
                        }}
                        disabled={!rtoDetail?.isSuccess}
                    />
                    {/* <Button text="More" variant="action" /> */}
                </div>
            </div>
            {rtoDetail.isError && <TechnicalError />}
            {rtoDetail?.isLoading ? (
                <LoadingAnimation />
            ) : rtoDetail?.data ? (
                <DetailTabs rto={rtoDetail?.data} />
            ) : (
                !rtoDetail.isError && (
                    <EmptyData
                        title={'No RTO Found'}
                        description={
                            'No detail were found or you request a wrong user'
                        }
                    />
                )
            )}
        </>
    )
}
RtoProfile.getLayout = (page: ReactElement) => {
    return <SubAdminLayout>{page}</SubAdminLayout>
}

export default withPermission(RtoProfile, {
    permissions: [PermissionType.VIEW_RTO_DETAIL],
})
