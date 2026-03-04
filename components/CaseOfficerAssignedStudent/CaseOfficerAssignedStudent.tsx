import { AuthorizedUserComponent, Typography } from '@components'
import { StudentStatusProgressCell } from '@components/StudentStatusProgressCell'
import { UserRoles } from '@constants'
import { ProgressCell } from '@partials/admin/student/components'
import { ViewStatusChangeHistoryModal } from '@partials/admin/student/modals'
import { Student, SubAdmin, UserStatus } from '@types'
import {
    WorkplaceCurrentStatus,
    checkStudentStatus,
    checkWorkplaceStatus,
    getStudentWorkplaceAppliedIndustry,
} from '@utils'
import { ReactElement, useState } from 'react'
import { WorkplaceWorkIndustriesType } from '@redux/queryTypes'

export const CaseOfficerAssignedStudent = ({
    student,
    workplaceFilter,
}: {
    student: Student
    workplaceFilter?: WorkplaceCurrentStatus
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [isSecondWorkplace, setIsSecondWorkplace] = useState<boolean>(false)

    const sortedWorkplace =
        student?.workplace && student?.workplace?.length > 0
            ? [...student?.workplace].sort((a: any, b: any) => {
                  // Check if either status is "completed"
                  if (
                      a.currentStatus === WorkplaceCurrentStatus.Completed &&
                      b.currentStatus !== WorkplaceCurrentStatus.Completed
                  ) {
                      return 1 // a goes after b
                  }
                  if (
                      a.currentStatus !== WorkplaceCurrentStatus.Completed &&
                      b.currentStatus === WorkplaceCurrentStatus.Completed
                  ) {
                      return -1 // a goes before b
                  }
                  // If neither or both are "completed", sort by createdAt date
                  return Date.parse(a.createdAt) - Date.parse(b.createdAt)
              })
            : []

    const workplace = sortedWorkplace?.filter(
        (w: any) => w?.currentStatus !== WorkplaceCurrentStatus.Cancelled
    )?.[0]
    // ?.reduce((a: any, b: any) => (b?.createdAt > a?.createdAt ? a : b), {
    //     currentStatus: WorkplaceCurrentStatus.NotRequested,
    // })

    const secondWorkplace = sortedWorkplace
        // ?.filter((w: any) => w?.id !== workplace?.id)
        ?.filter(
            (w: any) => w?.currentStatus !== WorkplaceCurrentStatus.Cancelled
        )?.[1]
    // ?.reduce((a: any, b: any) => (b?.createdAt > a?.createdAt ? a : b), {
    //     currentStatus: WorkplaceCurrentStatus.NotRequested,
    // })

    const updatedWorkplace = isSecondWorkplace ? secondWorkplace : workplace

    const industries = student?.industries
    const steps = checkWorkplaceStatus(updatedWorkplace?.currentStatus)
    const studentStatus = checkStudentStatus(student?.studentStatus)
    const appliedIndustry = getStudentWorkplaceAppliedIndustry(
        updatedWorkplace?.industries as WorkplaceWorkIndustriesType[]
    )
    const updatedAlliedIndustry = {
        ...appliedIndustry,
        appliedDate:
            appliedIndustry?.appliedDate || updatedWorkplace?.createdAt,
        interviewDate:
            appliedIndustry?.interviewDate || updatedWorkplace?.interviewDate,
        appointmentBookedDate:
            appliedIndustry?.appointmentBookedDate ||
            updatedWorkplace?.appointmentDate,
    }

    const onCancelModal = () => setModal(null)

    const checkKeysLength = (wp: any) =>
        Object.keys(wp)?.filter((s) => s !== 'currentStatus')?.length > 0

    const WorkplaceStatus = [
        {
            text: 'Industry sourcing',
            date: updatedAlliedIndustry?.appliedDate,
        },
        {
            text: 'Industry sourcing',
            date: appliedIndustry?.caseOfficerAssignedDate,
        },
        {
            text: 'Industry sourcing',
            date: updatedAlliedIndustry?.interviewDate,
        },
        {
            text: 'Meeting',
            date: updatedAlliedIndustry?.appointmentBookedDate,
        },
        {
            text: 'Awaiting Workplace Responce',
            date: updatedAlliedIndustry?.awaitingWorkplaceResponseDate,
        },
        {
            text: 'Agreement and Eligibility Pending',
            date: updatedAlliedIndustry?.awaitingAgreementSignedDate,
        },
        {
            text: 'Agreement Signed',
            date: updatedAlliedIndustry?.AgreementSignedDate,
        },
        {
            text: 'Placement Started',
            date: updatedAlliedIndustry?.placementStartedDate,
        },
        {
            text: 'Schedule Completed',
            date: updatedAlliedIndustry?.isCompletedDate,
        },
    ]

    const updatedStatus = WorkplaceStatus?.filter((wpStatus) => wpStatus?.date)

    const documentInitiates =
        student?.user?.signers && student?.user?.signers?.length > 0
            ? student?.user?.signers?.find(
                  (signer: any) => signer?.document?.status === 'pending'
              )
            : false

    return (
        <div className="w-70">
            {modal}
            {workplaceFilter ? (
                <ProgressCell
                    appliedIndustry={updatedAlliedIndustry}
                    studentId={student?.id}
                    assigned={updatedWorkplace?.assignedTo || student?.subadmin}
                    step={steps > 17 ? 17 : steps < 1 ? 1 : steps}
                    studentProvidedWorkplace={
                        updatedWorkplace?.studentProvidedWorkplace ||
                        updatedWorkplace?.byExistingAbn
                    }
                    documentInitiates={documentInitiates}
                    wpCreatedAt={updatedWorkplace?.createdAt}
                />
            ) : student?.workplace && student?.workplace?.length > 0 ? (
                <ProgressCell
                    appliedIndustry={updatedAlliedIndustry}
                    studentId={student?.id}
                    assigned={updatedWorkplace?.assignedTo || student?.subadmin}
                    step={steps > 17 ? 17 : steps < 1 ? 1 : steps}
                    studentProvidedWorkplace={
                        updatedWorkplace?.studentProvidedWorkplace ||
                        updatedWorkplace?.byExistingAbn
                    }
                    documentInitiates={documentInitiates}
                    wpCreatedAt={updatedWorkplace?.createdAt}
                />
            ) : industries?.length > 0 ? (
                <StudentStatusProgressCell
                    assigned={
                        (updatedWorkplace?.assignedTo as SubAdmin) ||
                        student?.subadmin
                    }
                    studentId={student?.id}
                    step={
                        workplace?.currentStatus ===
                        WorkplaceCurrentStatus.Cancelled
                            ? 4
                            : studentStatus
                    }
                    appliedIndustry={updatedAlliedIndustry}
                    studentProvidedWorkplace={
                        updatedWorkplace?.studentProvidedWorkplace ||
                        updatedWorkplace?.byExistingAbn
                    }
                    documentInitiates={documentInitiates}
                />
            ) : student?.user?.status === UserStatus.Archived ? (
                updatedWorkplace?.assignedTo || student?.subadmin ? (
                    <ProgressCell
                        appliedIndustry={updatedAlliedIndustry}
                        studentId={student?.id}
                        isAssigned
                        step={steps > 17 ? 17 : steps < 1 ? 1 : steps}
                        assigned={
                            updatedWorkplace?.assignedTo || student?.subadmin
                        }
                        studentProvidedWorkplace={
                            updatedWorkplace?.studentProvidedWorkplace ||
                            updatedWorkplace?.byExistingAbn
                        }
                        documentInitiates={documentInitiates}
                        wpCreatedAt={updatedWorkplace?.createdAt}
                    />
                ) : (
                    <ProgressCell
                        appliedIndustry={updatedAlliedIndustry}
                        studentId={student?.id}
                        assigned={
                            updatedWorkplace?.assignedTo || student?.subadmin
                        }
                        step={steps > 17 ? 17 : steps < 1 ? 1 : steps}
                        studentProvidedWorkplace={
                            updatedWorkplace?.studentProvidedWorkplace ||
                            updatedWorkplace?.byExistingAbn
                        }
                        documentInitiates={documentInitiates}
                        wpCreatedAt={updatedWorkplace?.createdAt}
                    />
                )
            ) : // <StudentStatusProgressCell
            //     assigned={
            //         (updatedWorkplace?.assignedTo as SubAdmin) ||
            //         student?.subadmin
            //     }
            //     studentId={student?.id}
            //     step={
            //         workplace?.currentStatus ===
            //         WorkplaceCurrentStatus.Cancelled
            //             ? 4
            //             : studentStatus
            //     }
            //     appliedIndustry={updatedAlliedIndustry}
            //     studentProvidedWorkplace={
            //         updatedWorkplace?.studentProvidedWorkplace ||
            //         updatedWorkplace?.byExistingAbn
            //     }
            //     documentInitiates={documentInitiates}
            // />
            student?.subadmin ? (
                <ProgressCell
                    isAssigned
                    appliedIndustry={updatedAlliedIndustry}
                    studentId={student?.id}
                    step={steps > 17 ? 17 : steps < 1 ? 1 : steps}
                    assigned={updatedWorkplace?.assignedTo || student?.subadmin}
                    studentProvidedWorkplace={
                        updatedWorkplace?.studentProvidedWorkplace ||
                        updatedWorkplace?.byExistingAbn
                    }
                    documentInitiates={documentInitiates}
                    wpCreatedAt={updatedWorkplace?.createdAt}
                />
            ) : (
                <ProgressCell
                    appliedIndustry={updatedAlliedIndustry}
                    studentId={student?.id}
                    step={1}
                    assigned={updatedWorkplace?.assignedTo || student?.subadmin}
                    studentProvidedWorkplace={
                        updatedWorkplace?.studentProvidedWorkplace ||
                        updatedWorkplace?.byExistingAbn
                    }
                    documentInitiates={documentInitiates}
                    wpCreatedAt={updatedWorkplace?.createdAt}
                />
            )}
            <div className="flex items-center justify-between gap-x-2 mt-1">
                {secondWorkplace && checkKeysLength(secondWorkplace) ? (
                    <div
                        className="bg-indigo-300 px-2 py-0.5 rounded-md cursor-pointer"
                        onClick={() => {
                            setIsSecondWorkplace(!isSecondWorkplace)
                        }}
                    >
                        <Typography variant={'xs'}>
                            View {isSecondWorkplace ? 'First' : 'Second'}{' '}
                            Workplace
                        </Typography>
                    </div>
                ) : null}

                <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                    {workplace &&
                    checkKeysLength(workplace) &&
                    updatedStatus?.length > 0 ? (
                        <div
                            className={
                                'bg-indigo-300 px-2 py-0.5 rounded-md  w-fit ml-auto cursor-pointer relative z-10'
                            }
                            onClick={() => {
                                setModal(
                                    <ViewStatusChangeHistoryModal
                                        onCancel={onCancelModal}
                                        updatedStatus={updatedStatus}
                                    />
                                )
                            }}
                        >
                            <Typography variant={'xs'}>
                                View Status History
                            </Typography>
                        </div>
                    ) : null}
                </AuthorizedUserComponent>
            </div>
        </div>
    )
}
