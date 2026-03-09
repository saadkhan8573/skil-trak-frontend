import { AuthorizedUserComponent, Typography } from '@components'
import { UserRoles } from '@constants'
import { AvailableMeetingDates, WorkplaceMapBoxView } from '@partials/student'
import { WorkplaceAvailableSlots } from '@partials/student/workplace/components/WorkplaceApproval/WorkplaceAvailableSlots'
import { WorkplaceInfo } from '@partials/student/workplace/components/WorkplaceApproval/WorkplaceInfo'
import { SubAdminApi } from '@queries'
import { Course, RtoApprovalWorkplaceRequest, SubAdmin } from '@types'
import { getLatLng, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AssignedCoordinator } from './AssignedCoordinator'
import { EligibleWorkplaceComponent } from './EligibleWorkplaceComponent'
import { VerifyCapacityComponent } from './VerifyCapacityComponent'

export const WorkplaceApprovalReq = ({
    wpReqApproval,
    coordinator,
    course,
}: {
    course: Course
    wpReqApproval: RtoApprovalWorkplaceRequest
    coordinator: SubAdmin
}) => {
    const [mount, setMount] = useState<boolean>(false)

    const role = getUserCredentials()?.role

    const router = useRouter()

    const subadmin = SubAdminApi.SubAdmin.useProfile(undefined, {
        skip: role !== UserRoles.SUBADMIN,
        refetchOnMountOrArgChange: true,
        // refetchOnFocus: true,
    })

    const [preferableLatLng, setPreferableLatLng] = useState<{
        lat: number
        lng: number
    } | null>(null)

    useEffect(() => {
        if (!mount) {
            setMount(true)
        }
    }, [])

    useEffect(() => {
        const fetchLatLng = async () => {
            const prefLoc = wpReqApproval?.workplaceRequest?.preferableLocation
            if (prefLoc) {
                try {
                    const coords = await getLatLng(prefLoc)
                    setPreferableLatLng(coords)
                } catch (error) {
                    console.error('Error fetching latlng:', error)
                }
            }
        }
        fetchLatLng()
    }, [wpReqApproval?.workplaceRequest?.preferableLocation])

    const studentLoc = preferableLatLng
        ? [String(preferableLatLng?.lat), String(preferableLatLng?.lng)]
        : wpReqApproval?.student?.location?.split(',') || []

    return (
        <div className="h-full">
            {!wpReqApproval?.isEligible ? (
                <EligibleWorkplaceComponent wpReqApproval={wpReqApproval} />
            ) : !wpReqApproval?.hasVerifiedCapacity ? (
                <VerifyCapacityComponent
                    courseId={course?.id}
                    wpReqApproval={wpReqApproval}
                />
            ) : (
                <div className="grid grid-cols-3 gap-x-6 items-center border-b border-[#F7910F] px-4 py-2">
                    <Typography variant="label" semibold block capitalize>
                        eligible workplace option for placement
                    </Typography>
                    <div className="col-span-2">
                        <Typography
                            variant="small"
                            medium
                            color="text-[#24556D]"
                        >
                            Workplace Approval Request has been sent to the
                            student once the student approves, you will be able
                            to update the request status.{' '}
                        </Typography>
                    </div>
                </div>
            )}

            <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                <div className="px-4 py-2.5 grid grid-cols-7 gap-x-4 gap-y-3">
                    <div className="col-span-5">
                        <div>
                            <Typography variant="label" medium block>
                                Workplace on map
                            </Typography>
                            <div className="rounded-xl w-full overflow-hidden mt-2">
                                {mount ? (
                                    <WorkplaceMapBoxView
                                        industryLocation={
                                            !wpReqApproval?.location
                                                ? wpReqApproval?.industry?.location?.split(
                                                      ','
                                                  )
                                                : wpReqApproval?.location?.location?.split(
                                                      ','
                                                  )
                                        }
                                        studentLocation={studentLoc}
                                        workplaceName={wpReqApproval?.industry}
                                        showMap
                                    />
                                ) : null}
                            </div>
                        </div>

                        {/*  */}
                        <div className="h-52">
                            <WorkplaceAvailableSlots
                                workingHours={
                                    wpReqApproval?.industry?.workingHours
                                }
                            />
                        </div>
                    </div>

                    {/*  */}
                    <div className="col-span-2 flex flex-col gap-y-3 h-full">
                        <div className="flex flex-col gap-y-1.5">
                            <AssignedCoordinator assignedTo={coordinator} />
                        </div>

                        <div>
                            <Typography variant="small" medium>
                                Course
                            </Typography>
                            <div className="border border-gray-300 rounded-md p-3">
                                <Typography variant="xs" color="text-gray-500">
                                    {course?.code}
                                </Typography>
                                <Typography
                                    variant="small"
                                    semibold
                                    color="text-gray-700"
                                >
                                    {course?.title}
                                </Typography>
                            </div>
                        </div>

                        {/*  */}
                        <div className="h-full">
                            <WorkplaceInfo
                                {...(role !== UserRoles?.ADMIN &&
                                !subadmin?.data?.isAdmin
                                    ? {
                                          direction:
                                              'flex-row justify-between px-4',
                                      }
                                    : {})}
                                // direction="flex-row justify-between px-4"
                                industry={wpReqApproval}
                            />
                        </div>

                        {/*  */}
                        <AvailableMeetingDates dates={wpReqApproval?.dates} />
                    </div>
                </div>
            </AuthorizedUserComponent>
            <AuthorizedUserComponent excludeRoles={[UserRoles.ADMIN]}>
                <div className="px-4 py-2.5 flex flex-col gap-x-4 gap-y-3">
                    <div className="grid grid-cols-2 gap-x-4 h-full">
                        <div className="flex flex-col">
                            <div className="grow">
                                <div className="h-full flex flex-col gap-y-3">
                                    <div className="flex flex-col gap-y-1.5">
                                        <AssignedCoordinator
                                            assignedTo={coordinator}
                                        />
                                    </div>

                                    {/*  */}
                                    <div className="h-full">
                                        <WorkplaceInfo
                                            industry={wpReqApproval}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  */}
                        <div className="flex flex-col">
                            <div className="grow">
                                <div>
                                    <Typography variant="small" medium>
                                        Course
                                    </Typography>
                                    <div className="border border-gray-300 rounded-md p-3">
                                        <Typography
                                            variant="xs"
                                            color="text-gray-500"
                                        >
                                            {course?.code}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            semibold
                                            color="text-gray-700"
                                        >
                                            {course?.title}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="h-full">
                                    <AvailableMeetingDates
                                        dates={wpReqApproval?.dates}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div>
                            <Typography variant="label" medium block>
                                Workplace on map
                            </Typography>
                            <div className="rounded-xl w-full overflow-hidden mt-2">
                                {mount ? (
                                    <WorkplaceMapBoxView
                                        industryLocation={
                                            !wpReqApproval?.location
                                                ? wpReqApproval?.industry?.location?.split(
                                                      ','
                                                  )
                                                : wpReqApproval?.location?.location?.split(
                                                      ','
                                                  )
                                        }
                                        studentLocation={studentLoc}
                                        workplaceName={wpReqApproval?.industry}
                                        showMap
                                    />
                                ) : null}
                            </div>
                        </div>

                        {/*  */}
                        <div className="h-52">
                            <WorkplaceAvailableSlots
                                workingHours={
                                    wpReqApproval?.industry?.workingHours
                                }
                            />
                        </div>
                    </div>

                    {/*  */}
                </div>
            </AuthorizedUserComponent>
        </div>
    )
}
