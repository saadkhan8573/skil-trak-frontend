import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

// components
import {
    EmptyData,
    LoadingAnimation,
    ShowErrorNotifications,
    TechnicalError,
    withPermission,
} from '@components'
import { checkStudentProfileCompletion, getUserCredentials } from '@utils'

//Layouts
import { SubAdminLayout } from '@layouts'
import { NextPageWithLayout, PermissionType } from '@types'

import { useContextBar, useNotification } from '@hooks'

// queries
import { StudentProfileForm } from '@partials/common'
import {
    SubAdminApi,
    useGetSubAdminStudentDetailQuery,
    useUpdateStudentProfileMutation,
} from '@queries'
import { CompleteProfileBeforeWpModal } from '@partials/common/StudentProfileDetail/components'
import { UserRoles } from '@constants'

const EditStudentDetail: NextPageWithLayout = () => {
    const contextBar = useContextBar()
    const { notification } = useNotification()

    const [modal, setModal] = useState<ReactElement | null>(null)
    const [showProfileModal, setShowProfileModal] = useState<boolean>(true)

    const router = useRouter()
    const { id } = router.query

    const role = getUserCredentials()?.role

    const student = useGetSubAdminStudentDetailQuery(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })
    const rtoDetail = SubAdminApi.Student.getStudentRtoDetail(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const courses = SubAdminApi.Student.useCourses(Number(id), {
        skip: !id,
        refetchOnMountOrArgChange: true,
    })

    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
    })
    const [updateDetail, updateDetailResult] = useUpdateStudentProfileMutation()

    useEffect(() => {
        contextBar.setContent(null)
        contextBar.hide()
    }, [])

    useEffect(() => {
        const handleProfileUpdate = async () => {
            if (
                updateDetailResult?.isSuccess &&
                student?.data &&
                !student?.isLoading &&
                !student?.isFetching &&
                rtoDetail?.data
            ) {
                // Show success notification
                notification.success({
                    title: 'Profile Updated',
                    description: 'Student Profile Updated',
                })

                // Get latest student data after update
                const values = {
                    ...student.data,
                    ...student.data.user,
                    rto: rtoDetail?.data,
                    courses: courses?.data,
                }

                const profileCompletion = checkStudentProfileCompletion(values)

                // Handle workplace routing based on profile completion
                if (router?.query?.wpType) {
                    if (
                        profileCompletion &&
                        profileCompletion > 0 &&
                        profileCompletion < 100
                    ) {
                        if (showProfileModal) {
                            setModal(
                                <CompleteProfileBeforeWpModal
                                    workplaceType={
                                        'provide-workplace-detail?tab=abn'
                                    }
                                    onCancel={() => {
                                        setModal(null)
                                        setShowProfileModal(false)
                                    }}
                                />
                            )
                        }
                    } else if (profileCompletion === 100) {
                        // Handle completed profile navigation
                        const wpType = router.query.wpType as string
                        if (wpType === 'provide-workplace-detail') {
                            router.push({
                                pathname: `/portals/sub-admin/students/${id}/provide-workplace-detail`,
                                query: { tab: 'abn' },
                            })
                        } else if (wpType === 'request-workplace-detail') {
                            router.push(
                                `/portals/sub-admin/students/${id}/request-workplace-detail`
                            )
                        }
                    }
                } else {
                    router.back()
                }
            }
        }

        handleProfileUpdate()
    }, [
        updateDetailResult?.isSuccess,
        student,
        courses?.data,
        router?.query?.wpType,
        rtoDetail?.data,
    ])

    // useEffect(() => {
    //     if (updateDetailResult?.isSuccess) {
    //         notification.success({
    //             title: 'Profile Updated',
    //             description: 'Student Profile Updated',
    //         })
    //         setTimeout(() => {
    //             if (router?.query?.wpType && student?.isSuccess) {
    //                 const values = {
    //                     ...student?.data,
    //                     ...student?.data?.user,
    //                     courses: courses?.data,
    //                 }
    //                 const profileCompletion =
    //                     checkStudentProfileCompletion(values)
    //                 if (
    //                     profileCompletion &&
    //                     profileCompletion > 0 &&
    //                     profileCompletion < 100 &&
    //                     showProfileModal
    //                 ) {
    //                     setModal(
    //                         <CompleteProfileBeforeWpModal
    //                             workplaceType={
    //                                 'provide-workplace-detail?tab=abn'
    //                             }
    //                             onCancel={() => {
    //                                 setModal(null)
    //                                 setShowProfileModal(false)
    //                             }}
    //                         />
    //                     )
    //                 } else if (profileCompletion === 100) {
    //                     switch (router?.query?.wpType) {
    //                         case 'provide-workplace-detail':
    //                             router.push({
    //                                 pathname: `/portals/sub-admin/students/${id}/provide-workplace-detail`,
    //                                 query: { tab: 'abn' },
    //                             })
    //                             break
    //                         case 'request-workplace-detail':
    //                             router.push(
    //                                 `/portals/sub-admin/students/${id}/request-workplace-detail`
    //                             )
    //                             break

    //                         default:
    //                             break
    //                     }
    //                 }
    //             } else {
    //                 router.back()
    //             }
    //         }, 600)
    //     }
    // }, [updateDetailResult, student, router])

    const onSubmit = async (values: any) => {
        if (!values?.courses) {
            delete values?.courses
        }
        const { name, email, ...rest } = values
        const dob = new Date(values.dob)
        dob.setDate(dob.getDate() + 1)

        const res: any = await updateDetail({
            id: student?.data?.id,
            body: {
                ...rest,
                ...(rest?.courses
                    ? {
                          courses: rest?.courses?.map((course: any) => ({
                              id: course?.value,
                          })),
                      }
                    : {}),
                dob,
                isInternational:
                    values?.isInternational === 'international' ? true : false,
                user: {
                    id: student?.data?.user?.id,
                    name,
                    email,
                },
            },
        })

        if (res?.data) {
            setShowProfileModal(true)
        }
    }
    return (
        <>
            {modal}
            <ShowErrorNotifications result={updateDetailResult} />
            {/* <UpdateDetails onSubmit={onSubmit} result={updateDetailResult} /> */}
            <div className="px-4">
                {student.isError && <TechnicalError />}
                {student.isLoading || student.isFetching ? (
                    <LoadingAnimation height={'h-[70vh]'} />
                ) : student.data && student.isSuccess ? (
                    <StudentProfileForm
                        onSubmit={onSubmit}
                        rtoDetail={rtoDetail?.data}
                        profile={student}
                        result={updateDetailResult}
                        courses={courses}
                        isHod={subadmin?.data?.departmentMember?.isHod}
                    />
                ) : (
                    !student.isError && student.isSuccess && <EmptyData />
                )}
            </div>
        </>
    )
}
EditStudentDetail.getLayout = (page: ReactElement) => {
    return (
        <SubAdminLayout pageTitle={{ title: 'Edit Student Detail' }}>
            {page}
        </SubAdminLayout>
    )
}

export default withPermission(EditStudentDetail, {
    permissions: [PermissionType.ALLOW_UPDATE_PROFILE],
})
