import { UserRoles } from '@constants'
import { useRouter } from 'next/router'
import { MdCancel } from 'react-icons/md'
import { getUserCredentials } from '@utils'
import { PiWarningOctagonThin } from 'react-icons/pi'
import { Button, GlobalModal, Typography } from '@components'

export const CompleteProfileBeforeWpModal = ({
    onCancel,
    workplaceType,
}: {
    onCancel?: () => void
    workplaceType: string | null
}) => {
    const router = useRouter()

    const role = getUserCredentials()?.role

    return (
        <GlobalModal>
            <div className="max-w-2xl p-5 relative flex flex-col gap-y-2 py-5">
                {onCancel ? (
                    <MdCancel
                        onClick={() => {
                            if (onCancel) {
                                onCancel()
                            }
                        }}
                        className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
                    />
                ) : null}
                <div className="flex flex-col gap-y-2 justify-between items-center">
                    <PiWarningOctagonThin className="text-primary text-8xl" />
                    <div className="mx-auto">
                        <Typography center semibold>
                            Complete Profile Before Add Workplace
                        </Typography>
                    </div>
                </div>
                <div>
                    <Typography center>
                        <span className="text-[15px] leading-4 text-center">
                            Before adding a workplace to a student's profile,
                            ensure all academic details and personal information
                            are complete. This comprehensive profile enhances
                            the relevance and accuracy of professional
                            experiences listed.
                        </span>
                    </Typography>
                    <Typography center>
                        <span className="text-[15px] font-bold leading-4 text-center">
                            N/A does not work, provide a valid detail
                        </span>
                    </Typography>
                </div>
                <div className="mx-auto mt-3">
                    <Button
                        text="Complete Profile"
                        onClick={() => {
                            const studentId = router?.query?.id

                            let editPath = `/portals/sub-admin/students/${studentId}/edit-student` // default

                            if (role === UserRoles.ADMIN) {
                                editPath = `/portals/admin/student/edit-student/${studentId}`
                            } else if (role === UserRoles.RTO) {
                                if (
                                    router.pathname.includes(
                                        'students-and-placements'
                                    )
                                ) {
                                    editPath = `/portals/rto/students-and-placements/all-students/${studentId}/edit-student`
                                } else {
                                    editPath = `/portals/rto/students/${studentId}/edit-student`
                                }
                            } else if (role === UserRoles.SUBADMIN) {
                                editPath = `/portals/sub-admin/students/${studentId}/edit-student`
                            }

                            router.push({
                                pathname: editPath,
                                query: { wpType: workplaceType },
                            })
                            if (onCancel) {
                                onCancel()
                            }
                        }}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}
