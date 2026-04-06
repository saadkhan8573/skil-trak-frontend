import {
    Button,
    LoadingAnimation,
    NoData,
    ShowErrorNotifications,
    useIsRestricted,
} from '@components'
import { SubAdminApi, useAddExistingIndustriesMutation } from '@queries'
import { CheckCircle2, MapPin, Phone, Sparkles } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { IoDocumentTextOutline } from 'react-icons/io5'

import { UserRoles } from '@constants'
import {
    useContextBar,
    useNotification,
    useSubadminProfile,
    useWorkplace,
} from '@hooks'
import { IndustryDetailCB } from '@partials/common/MapBox/contextBar'
import { ComposeMailModal } from '@partials/common/StudentProfileDetail/modals'
import { getSectorsDetail, getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { IoEyeOutline } from 'react-icons/io5'
import { LuPhoneCall } from 'react-icons/lu'
import {
    MaxReqLimitReachModal,
    ShowIndustryNotesAndTHModal,
} from '../../../../../modals'
import { CallStatus } from './CallStatus'
import { OnViewMapCallAnswer } from './OnViewMapCallAnswer'
import moment from 'moment'

export const OnViewMapIndustryDetailsTab = ({
    selectedBox,
    workplace,
    onCancel,
    industryDetails,
    appliedIndustry,
}: any) => {
    const [call, setShowCall] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const { notification } = useNotification()
    const canAssessData = useIsRestricted(UserRoles.INDUSTRY)
    const contextBar = useContextBar()
    const router = useRouter()
    const {
        workplaceData,
        setWorkplaceData,
        setStudentLocation,
        setIndustryLocation,
    } = useWorkplace()

    const workplaceId = workplace?.id
    const industryId = selectedBox?.id
    const branchId = selectedBox?.type === 'branch' && selectedBox?.id
    const id = selectedBox?.type === 'branch' ? branchId : industryId

    useEffect(() => {
        if (workplaceData?.type === 'limitExceed') {
            setModal(
                <MaxReqLimitReachModal
                    onCancel={() => setModal(null)}
                    industryName={workplaceData?.name}
                    industryCapacity={workplaceData?.industryCapacity}
                    // studentCapacity={workplaceData?.name}
                />
            )
            setWorkplaceData(null)
        }
    }, [workplaceData])

    const subadmin = useSubadminProfile()

    const [addExistingIndustry, addExistingIndustryResult] =
        useAddExistingIndustriesMutation()
    const [contactWorkplaceIndustry, contactWorkplaceIndustryResult] =
        SubAdminApi.Workplace.contactWorkplaceIndustry()
    const [callLog, callLogResult] = SubAdminApi.Industry.useIndustryCallLog()

    const sectors = getSectorsDetail(selectedBox?.courses)

    const onModalCancelClicked = () => setModal(null)

    const onApplyIndustryModal = () => {
        setIndustryLocation(industryDetails?.data?.location)
        setStudentLocation(workplace?.student?.location)
        setModal(
            <ShowIndustryNotesAndTHModal
                industryUserId={industryDetails?.data?.user?.id}
                industryUserName={industryDetails?.data?.user?.name}
                industryCapacity={industryDetails?.data?.studentCapacity}
                industryId={selectedBox?.activeBranch?.id || selectedBox?.id}
                workplaceId={workplaceId}
                onCancel={(cancel?: boolean) => {
                    onModalCancelClicked()
                    if (cancel) {
                        onCancel()
                    }
                }}
                type={
                    selectedBox?.activeBranch?.id && selectedBox?.isBranch
                        ? 'branch'
                        : ''
                }
            />
        )
    }

    const onComposeMail = () => {
        setModal(
            <ComposeMailModal
                userId={Number(industryDetails?.data?.user?.id)}
                user={industryDetails?.data?.user}
                onCancel={onModalCancelClicked}
                workplaceId={workplaceId}
            />
        )
    }

    const onViewIndustryDetail = () => {
        contextBar.show(false)
        contextBar.setContent(
            <IndustryDetailCB
                id={selectedBox?.id}
                industryUserId={industryDetails?.data?.user?.id}
            />
        )
        contextBar.setTitle('Industry Details')
    }

    const rolesIncludes = [UserRoles.ADMIN, UserRoles.RTO]

    const role = getUserCredentials()?.role
    const toggleCall = () => setShowCall((prev) => !prev)
    const industry = industryDetails?.data ?? {}
    const hasPhone = Boolean(industry?.phoneNumber?.trim())
    const callLogEntry =
        industryDetails?.data?.callLog?.length > 0
            ? industryDetails?.data?.callLog[0]
            : null

    const wasContacted = callLogEntry?.isAnswered !== null

    const buttonText = call ? 'Hide' : 'Call'

    const isDisabled = callLogResult.isLoading
    // ||
    // (!hasPhone && callLogEntry?.isAnswered !== null)

    const handleCall = () => {
        toggleCall()

        if (!call && hasPhone) {
            const commonPayload = {
                studentId: Number(router?.query?.id),
                wpId: workplaceId,
            }

            if (selectedBox?.type === 'branch') {
                navigator.clipboard.writeText(
                    industry.branchContactPersonNumber
                )
                contactWorkplaceIndustry({
                    ...commonPayload,
                    branchId: industry.id,
                })

                callLog({
                    branch: industry.id,
                    workplaceId,
                })
            } else {
                contactWorkplaceIndustry({
                    ...commonPayload,
                    industryId: industry.id,
                })
                navigator.clipboard.writeText(industry.phoneNumber)
                callLog({
                    industry: industry.id,
                    workplaceId,
                    receiver: UserRoles.INDUSTRY,
                }).then((res: any) => {
                    if (res?.data) {
                        notification.success({
                            title: 'Called Industry',
                            description: `Called Industry with Name: ${industry?.user?.name}`,
                        })
                    }
                })
            }

            notification.success({
                title: 'Copied',
                description: 'Phone Number Copied',
            })
        } else if (!call) {
            notification.error({
                title: 'Missing Number',
                description:
                    'Please update the Industry Phone Number from Edit Profile',
            })
        }
    }

    return (
        <>
            <ShowErrorNotifications
                result={callLogResult || contactWorkplaceIndustryResult}
            />
            {modal}
            {industryDetails.isError && (
                <NoData text="Something is not right...!" />
            )}
            {industryDetails.isLoading ? (
                <LoadingAnimation />
            ) : industryDetails?.data ? (
                <>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div
                                className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${
                                    // industry.contacted
                                    true
                                        ? 'bg-linear-to-br from-emerald-500 to-emerald-600'
                                        : 'bg-linear-to-br from-[#044866] to-[#0D5468]'
                                }`}
                            >
                                {true ? (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                    <span className="text-sm">
                                        industry.category
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3
                                    className={`font-semibold text-sm truncate ${
                                        true
                                            ? 'text-emerald-700'
                                            : 'text-gray-800'
                                    }`}
                                >
                                    {industryDetails?.data?.user?.name ?? 'NA'}
                                </h3>
                                {industryDetails?.data?.emails?.length > 0 && (
                                    <div className="flex items-center gap-x-2 text-xs font-medium text-indigo-600 bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1.5 mt-1 w-fit">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                        <span>Email Sent</span>
                                        {moment(
                                            industryDetails?.data?.emails?.[0]
                                                ?.updatedAt
                                        ).format('DD MMM YYYY, hh:mm A')}
                                    </div>
                                )}
                                <CallStatus
                                    callLogEntry={callLogEntry}
                                    wasContacted={wasContacted}
                                />
                                {/* <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-[#F7A619] fill-current" />
                                    <span className="text-xs font-medium text-[#F7A619]">
                                        4.5/5
                                    </span>
                                </div> */}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>
                                    {industryDetails?.data?.addressLine1 ??
                                        'NA'}
                                </span>
                                {/* <span>•</span>
                                <Users className="h-3 w-3" />
                                <span>
                                    placed{' '}
                                    {industryDetails?.data?.enrolledStudents ??
                                        0}
                                </span> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mt-4 px-2">
                        <div className="flex flex-col gap-y-2">
                            <Button
                                text={buttonText}
                                Icon={LuPhoneCall}
                                variant="primaryNew"
                                onClick={handleCall}
                                loading={callLogResult.isLoading}
                                disabled={isDisabled}
                                outline
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Button
                                text="Email"
                                Icon={IoDocumentTextOutline}
                                variant="secondary"
                                onClick={onComposeMail}
                                outline
                            />
                        </div>
                    </div>
                    <div className="flex justify-between w-full"></div>
                    {/* Call */}
                    {call && (
                        <div className="cursor-not-allowed">
                            <div className="h-px mt-4 mb-1 w-full bg-gray-300" />
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-3 w-3 text-emerald-600" />
                                    <span className="text-xs font-medium">
                                        Call Notes
                                    </span>
                                </div>
                            </div>
                            <OnViewMapCallAnswer
                                callLog={industryDetails?.data?.callLog?.[0]}
                                workplaceId={workplaceId}
                                // setShowCall={setShowCall}
                            />
                        </div>
                    )}

                    {/* {!hasPhone &&
                    industryDetails?.data?.callLog?.[0]?.isAnswered === true ? (
                        <div className="cursor-not-allowed">
                            <div className="h-[1px] mt-4 mb-1 w-full bg-gray-300" />
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-3 w-3 text-emerald-600" />
                                    <span className="text-xs font-medium">
                                        Call Notes
                                    </span>
                                </div>
                            </div>
                            <OnViewMapCallAnswer
                                callLog={industryDetails?.data?.callLog?.[0]}
                                workplaceId={workplaceId}
                            />
                        </div>
                    ) : !hasPhone &&
                      industryDetails?.data?.callLog?.[0]?.isAnswered ===
                          false ? (
                        <div className="cursor-not-allowed">
                            <div className="h-[1px] mt-4 mb-1 w-full bg-gray-300" />
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-3 w-3 text-emerald-600" />
                                    <span className="text-xs font-medium">
                                        Call Notes
                                    </span>
                                </div>
                            </div>
                            <OnViewMapCallAnswer
                                callLog={industryDetails?.data?.callLog?.[0]}
                                workplaceId={workplaceId}
                            />
                        </div>
                    ) : null} */}
                    <div className="bg-[#044866]/5 rounded-lg p-2 border border-[#044866]/10 mt-2">
                        <div className="flex items-center gap-1 mb-2">
                            <Sparkles className="h-3 w-3 text-[#044866]" />
                            <span className="text-xs font-medium text-[#044866]">
                                Quick Actions
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <Button
                                text="Apply"
                                Icon={IoDocumentTextOutline}
                                variant="info"
                                outline
                                onClick={onApplyIndustryModal}
                                loading={addExistingIndustryResult.isLoading}
                                disabled={
                                    appliedIndustry ||
                                    addExistingIndustryResult.isLoading
                                }
                            />
                            <Button
                                text="view"
                                Icon={IoEyeOutline}
                                onClick={onViewIndustryDetail}
                                outline
                            />
                        </div>
                    </div>
                </>
            ) : (
                <NoData text="No data found" />
            )}
        </>
    )
}
