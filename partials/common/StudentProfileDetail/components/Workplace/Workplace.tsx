import {
    ActionButton,
    AuthorizedUserComponent,
    Badge,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    TechnicalError,
    Typography,
} from '@components'
import { UserRoles } from '@constants'

import { useWorkplace } from '@hooks'
import { Course, Student } from '@types'
import { checkStudentProfileCompletion, WorkplaceCurrentStatus } from '@utils'
import moment from 'moment'
import { useEffect } from 'react'
import {
    AddWorkplaceAction,
    CancelledWorkplaceCard,
    CancelWpRequest,
    ContactPersonDetail,
    IndustryStatus,
    ViewAvailability,
    WorkplaceCoordinators,
    WorkplaceFeedback,
    WorkplaceHistory,
    WorkplaceStatusView,
    WorkplaceTab,
    WpApprovalReqRejected,
    WpApprovalRequest,
    WpCourse,
} from './components'
import { IndustryDetail } from './components/IndustryDetail'
import { WPStatusForCancelButon } from './data'
import { useWorkplaceHook } from './hooks'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { WPProcessMatchingLoader } from './components/IndustryDetail/components/WPProcessMatchingLoader'

export const Workplace = ({
    student,
    getWorkplaceLength,
}: {
    getWorkplaceLength: (length: number) => void
    student: Student
}) => {
    // TODO: If student expired, schedule is completed and student is in Incomplete Submission tab, then show Incomplete Submission tag in workplace section

    const { workplaceRto, setWorkplaceRes } = useWorkplace()
    const {
        modal,
        course,
        folders,
        courses,
        onAddAnotherWp,
        getCancelledWP,
        appliedIndustry,
        sortedWorkplace,
        studentWorkplace,
        onCancelWPClicked,
        ignoreCompletedWP,
        autoApplyLoader,
        selectedWorkplace,
        appointmentDetail,
        setSelectedWorkplace,
        showPreviousWorkplace,
        workplaceStudentDetail,
        workplaceIndustryDetail,
        setShowPreviousWorkplace,
        onCancelWPRequestClicked,
        onViewWorkplaceQuestions,
        onShowRejectedRequestModal,
        onViewPlacementStartedAnswers,
        onUpdateWorkplaceCourseClicked,
        latestWorkplaceApprovaleRequest,
        latestWorkplaceApprovaleRequestRto,
    } = useWorkplaceHook()

    const values = {
        ...student,
        ...student?.user,
        courses: courses?.data,
        rto: workplaceRto,
    }

    useEffect(() => {
        if (sortedWorkplace && sortedWorkplace?.length > 0) {
            setWorkplaceRes(sortedWorkplace)
            getWorkplaceLength(sortedWorkplace?.length)
        }
        return () => {
            setSelectedWorkplace(null)
        }
    }, [studentWorkplace?.data])

    const profileCompletion = checkStudentProfileCompletion(values)

    const togglePreviousWorkplace = () => {
        setShowPreviousWorkplace(!showPreviousWorkplace)
    }

    return (
        <>
            {modal}
            <Card noPadding fullHeight>
                <div className="px-4 py-3.5 flex justify-between items-center border-b border-secondary-dark">
                    <Typography variant="label" semibold>
                        Workplace
                        <span className="text-xs text-gray-500 font-normal">
                            {selectedWorkplace
                                ? selectedWorkplace?.studentProvidedWorkplace ||
                                  selectedWorkplace?.byExistingAbn
                                    ? '- Student Provided Workplace'
                                    : '- Requested Workplace'
                                : null}
                        </span>
                    </Typography>
                    <div className="flex items-center gap-x-2">
                        <AuthorizedUserComponent
                            roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            isAssociatedWithRto={false}
                        >
                            <div>
                                <Button
                                    text={
                                        showPreviousWorkplace
                                            ? 'Current WP'
                                            : 'Cancelled WP'
                                    }
                                    variant={
                                        showPreviousWorkplace
                                            ? 'success'
                                            : 'error'
                                    }
                                    onClick={togglePreviousWorkplace}
                                />
                                {/* )} */}
                            </div>
                        </AuthorizedUserComponent>
                        <AuthorizedUserComponent
                            roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                        >
                            <div>
                                {selectedWorkplace
                                    ? !selectedWorkplace?.studentProvidedWorkplace &&
                                      !selectedWorkplace?.byExistingAbn &&
                                      Number(selectedWorkplace?.questions) >
                                          0 && (
                                          <ActionButton
                                              variant={'link'}
                                              onClick={() => {
                                                  onViewWorkplaceQuestions(
                                                      Number(
                                                          selectedWorkplace?.id
                                                      )
                                                  )
                                              }}
                                          >
                                              View Answers
                                          </ActionButton>
                                      )
                                    : null}
                            </div>
                        </AuthorizedUserComponent>
                        {ignoreCompletedWP &&
                        ignoreCompletedWP?.length === 1 ? (
                            <div className="">
                                <AuthorizedUserComponent
                                    roles={[UserRoles.SUBADMIN]}
                                >
                                    <AddWorkplaceAction
                                        id={student?.id}
                                        profileCompletion={100}
                                        text={'Add Another WP'}
                                        onButtonClick={() => onAddAnotherWp()}
                                    />
                                </AuthorizedUserComponent>
                            </div>
                        ) : null}
                        {!ignoreCompletedWP?.length ? (
                            <AuthorizedUserComponent
                                roles={[UserRoles.SUBADMIN]}
                            >
                                <AddWorkplaceAction
                                    text="Add WP"
                                    id={student?.id}
                                    profileCompletion={profileCompletion}
                                />
                            </AuthorizedUserComponent>
                        ) : null}
                    </div>
                </div>

                {studentWorkplace.isError ? (
                    <TechnicalError height="h-64" description={false} />
                ) : null}

                {studentWorkplace?.isLoading ? (
                    <LoadingAnimation />
                ) : studentWorkplace?.data &&
                  studentWorkplace?.data?.length > 0 &&
                  !showPreviousWorkplace ? (
                    <>
                        {studentWorkplace?.data &&
                            studentWorkplace?.data?.length > 1 && (
                                <div className="border-b border-secondary-dark p-4 flex items-center gap-x-2.5 cursor-pointer">
                                    {sortedWorkplace?.map(
                                        (workplace: any, i: number) => (
                                            <WorkplaceTab
                                                index={i}
                                                key={workplace.id}
                                                active={
                                                    selectedWorkplace?.id ===
                                                    workplace?.id
                                                }
                                                onClick={() => {
                                                    setSelectedWorkplace(
                                                        workplace
                                                    )
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        {/*  */}
                        {studentWorkplace.isError ? (
                            <TechnicalError height="h-64" description={false} />
                        ) : null}
                        {studentWorkplace?.isLoading ? (
                            <div className="flex flex-col items-center justify-center h-60">
                                <LoadingAnimation size={60} />
                                <Typography variant="label">
                                    Workplace Loading...
                                </Typography>
                            </div>
                        ) : autoApplyLoader ? (
                            <WPProcessMatchingLoader />
                        ) : studentWorkplace?.data &&
                          studentWorkplace?.data?.length > 0 &&
                          studentWorkplace?.isSuccess ? (
                            latestWorkplaceApprovaleRequest &&
                            latestWorkplaceApprovaleRequest?.status ===
                                'pending' &&
                            workplaceStudentDetail?.isSuccess ? (
                                <WpApprovalRequest
                                    latestWorkplaceApprovaleRequest={
                                        latestWorkplaceApprovaleRequest
                                    }
                                    onCancelWPClicked={onCancelWPClicked}
                                    onCancelWPRequestClicked={
                                        onCancelWPRequestClicked
                                    }
                                    selectedWorkplace={selectedWorkplace}
                                    workplaceStudentDetail={
                                        workplaceStudentDetail
                                    }
                                />
                            ) : (
                                <div>
                                    <div className="pt-2.5 pb-1 px-4 border-b border-secondary-dark flex flex-col lg:flex-row justify-between gap-x-4">
                                        <IndustryStatus
                                            folders={folders}
                                            workplace={selectedWorkplace}
                                            appliedIndustry={appliedIndustry}
                                            student={
                                                workplaceStudentDetail?.data
                                            }
                                            appointmentDetail={
                                                appointmentDetail
                                            }
                                        />

                                        <div className="w-full">
                                            <div className="flex justify-end divide-x-2 ">
                                                <AuthorizedUserComponent
                                                    excludeRoles={[
                                                        UserRoles.OBSERVER,
                                                    ]}
                                                >
                                                    <ContactPersonDetail
                                                        appliedIndustry={
                                                            appliedIndustry
                                                        }
                                                    />
                                                </AuthorizedUserComponent>
                                                <WorkplaceHistory
                                                    wpId={Number(
                                                        selectedWorkplace?.id
                                                    )}
                                                />
                                                <div className="">
                                                    <ViewAvailability
                                                        wpId={Number(
                                                            selectedWorkplace?.id
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <WorkplaceStatusView
                                                currentStatus={
                                                    selectedWorkplace?.currentStatus as WorkplaceCurrentStatus
                                                }
                                            />
                                            <div className="flex items-end justify-between">
                                                <WpCourse
                                                    wpCourse={
                                                        selectedWorkplace
                                                            ?.courses?.[0] as Course
                                                    }
                                                    onClick={() => {
                                                        onUpdateWorkplaceCourseClicked(
                                                            Number(
                                                                selectedWorkplace
                                                                    ?.courses?.[0]
                                                                    ?.id
                                                            ),
                                                            Number(
                                                                selectedWorkplace?.id
                                                            )
                                                        )
                                                    }}
                                                />

                                                {appliedIndustry?.isAutomated && (
                                                    <div className="border shadow-xl px-1 py-0.5 rounded bg-green-500 ">
                                                        <Typography
                                                            variant="xxs"
                                                            color={'text-white'}
                                                            uppercase
                                                        >
                                                            Auto
                                                        </Typography>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className="p-4 grid grid-cols-1 lg:grid-cols-10 gap-y-4 gap-x-3 border-b border-secondary-dark">
                                        <div className="lg:col-span-3 h-full">
                                            <WorkplaceCoordinators
                                                appliedIndustryId={
                                                    appliedIndustry?.id
                                                }
                                                workplace={selectedWorkplace}
                                            />
                                        </div>
                                        <div className="lg:col-span-7 h-full">
                                            <IndustryDetail
                                                workplace={
                                                    selectedWorkplace as IWorkplaceIndustries
                                                }
                                                appliedIndustry={
                                                    appliedIndustry
                                                }
                                                wpIndustriesLength={
                                                    workplaceIndustryDetail
                                                        ?.data?.length
                                                }
                                                student={
                                                    workplaceStudentDetail?.data
                                                }
                                                course={course as Course}
                                                approvalDate={
                                                    latestWorkplaceApprovaleRequest?.approvalDate
                                                }
                                                latestWorkplaceApprovaleRequest={
                                                    latestWorkplaceApprovaleRequest
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-4">
                                        <div className="flex items-center gap-x-2.5">
                                            {WPStatusForCancelButon.includes(
                                                selectedWorkplace?.currentStatus as WorkplaceCurrentStatus
                                            ) ? (
                                                !selectedWorkplace
                                                    ?.cancelledRequests
                                                    ?.length ? (
                                                    <CancelWpRequest
                                                        onCancelWPClicked={
                                                            onCancelWPClicked
                                                        }
                                                        onCancelWPRequestClicked={
                                                            onCancelWPRequestClicked
                                                        }
                                                    />
                                                ) : (
                                                    <div className="w-56">
                                                        <Badge
                                                            variant="warning"
                                                            text="WP Cancelation Request Sent to Admin, wait for APPROVAL!"
                                                        />
                                                    </div>
                                                )
                                            ) : null}
                                            {latestWorkplaceApprovaleRequest?.status ===
                                                'rejected' &&
                                            !latestWorkplaceApprovaleRequestRto?.isSkipped ? (
                                                <WpApprovalReqRejected
                                                    onClick={() => {
                                                        onShowRejectedRequestModal(
                                                            latestWorkplaceApprovaleRequest?.comment
                                                        )
                                                    }}
                                                />
                                            ) : null}
                                            {latestWorkplaceApprovaleRequestRto?.rtoApprovalStatus ===
                                            'rejected' ? (
                                                <WpApprovalReqRejected
                                                    onClick={() => {}}
                                                    userName="Rto"
                                                />
                                            ) : null}
                                            {selectedWorkplace
                                                ? selectedWorkplace?.studentFeedBack >
                                                      0 && (
                                                      <WorkplaceFeedback
                                                          selectedWorkplace={
                                                              selectedWorkplace
                                                          }
                                                          onViewPlacementStartedAnswers={
                                                              onViewPlacementStartedAnswers
                                                          }
                                                      />
                                                  )
                                                : null}
                                        </div>
                                        <Typography variant="small" medium>
                                            Recieved On:{' '}
                                            {moment(
                                                selectedWorkplace?.createdAt
                                            ).format('Do MMM, YYYY')}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        ) : (
                            studentWorkplace?.isSuccess && (
                                <EmptyData
                                    imageUrl={'/images/workplace/icon.png'}
                                    title="No Workplace Found"
                                    description="Add a workplace to view workplace here"
                                    height="40vh"
                                />
                            )
                        )}
                    </>
                ) : (
                    studentWorkplace?.isSuccess &&
                    !showPreviousWorkplace && (
                        <EmptyData
                            imageUrl={'/images/workplace/icon.png'}
                            title="No Workplace Found"
                            description="Add a workplace to view workplace here"
                            height="40vh"
                        />
                    )
                )}

                {/* {!showPreviousWorkplace && (
                    <div className="p-2">
                        <CancelledWorkplaceList
                            rejectedWorkplaces={rejectedWorkplaces}
                        />
                    </div>
                )} */}

                {showPreviousWorkplace ? (
                    getCancelledWP?.data && getCancelledWP?.data?.length > 0 ? (
                        <div className="flex flex-col gap-y-2 h-[27rem] overflow-auto custom-scrollbar">
                            {getCancelledWP?.data?.map((cancelledWp: any) => (
                                <CancelledWorkplaceCard
                                    cancelledWp={cancelledWp}
                                />
                            ))}
                        </div>
                    ) : (
                        studentWorkplace?.isSuccess && (
                            <EmptyData
                                imageUrl={'/images/workplace/icon.png'}
                                title="No Cancelled Workplace Found"
                                description="There is no cancelled workplace found for this student."
                                height="40vh"
                            />
                        )
                    )
                ) : null}
            </Card>
        </>
    )
}
