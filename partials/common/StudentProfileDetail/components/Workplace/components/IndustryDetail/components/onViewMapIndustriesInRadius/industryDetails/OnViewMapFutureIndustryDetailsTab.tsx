import {
    Badge,
    Button,
    GlobalModal,
    LoadingAnimation,
    NoData,
    Portal,
    ShowErrorNotifications,
} from '@components'
import { UserRoles } from '@constants'
import { useContextBar, useNotification } from '@hooks'
import {
    ComposeListingIndustryMail,
    DoNotDisturbModal,
} from '@partials/common/FindWorkplaces'
import { IndustryListingCB } from '@partials/common/MapBox/contextBar'
import { CommonApi, SubAdminApi } from '@queries'
import { IndustryStatus } from '@types'
import { ellipsisText, getUserCredentials } from '@utils'
import { CheckCircle2, MapPin, Phone, Sparkles } from 'lucide-react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { FiUserMinus, FiUserPlus } from 'react-icons/fi'
import { IoDocumentTextOutline, IoEyeOutline } from 'react-icons/io5'
import { LuPhoneCall } from 'react-icons/lu'
import { CallStatus } from './CallStatus'
import { OnViewMapCallAnswer } from './OnViewMapCallAnswer'
export const OnViewMapFutureIndustryDetailsTab = ({
    selectedBox,
    workplace,
    onCancel,
    industryDetails,
}: any) => {
    const [call, setShowCall] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const workplaceId = workplace?.id
    const industryId = selectedBox?.id
    const router = useRouter()
    const contextBar = useContextBar()
    const role = getUserCredentials()?.role

    const getStudentId = () => {
        if (!router.isReady) return undefined

        // SUB ADMIN → explicit param
        // if (role === 'subadmin') {
        return Number(router.query.studentId)
        // }

        // RTO + ADMIN → last URL segment
        // if (role === 'rto' || role === 'admin') {
        //     return Number(router.asPath.split('/').pop())
        // }

        return undefined
    }

    const studentId = getStudentId()
    console.log('studentId', studentId)
    console.log('router', router.query)
    const [addToContacted, addToContactedResult] =
        SubAdminApi.Workplace.contactWorkplaceIndustry()
    const [callLog, callLogResult] =
        CommonApi.FindWorkplace.useFutureIndustryCallLog()

    const sectors = selectedBox?.sector
    const callLogEntry =
        industryDetails?.data?.callLog?.length > 0
            ? industryDetails?.data?.callLog[0]
            : null

    const wasContacted = callLogEntry?.isAnswered !== null

    const { notification } = useNotification()

    useEffect(() => {
        if (addToContactedResult.isSuccess) {
            notification.success({
                title: 'Industry Contacted',
                description: 'Industry Contacted Successfully',
            })
        }
    }, [addToContactedResult.isSuccess])

    const onDoNotDisturbClicked = (industry: any) => {
        setModal(
            <Portal>
                <DoNotDisturbModal
                    industry={industry}
                    onCancel={() => setModal(null)}
                />
            </Portal>
        )
    }

    const statusData = () => {
        switch (selectedBox?.status) {
            case IndustryStatus.FAVOURITE:
                return <Badge variant="success" text={selectedBox?.status} />
            case IndustryStatus.DO_NOT_DISTURB:
                return <Badge variant="error" text={selectedBox?.status} />
            case IndustryStatus.BLOCKED:
                return <Badge variant="error" text={selectedBox?.status} />
            case IndustryStatus.DEFAULT:
                return <Badge variant="info" text={selectedBox?.status} />

            default:
                return <p>---</p>
        }
    }
    const onViewIndustryListingDetail = () => {
        contextBar.show(false)
        contextBar.setContent(<IndustryListingCB id={selectedBox?.id} />)
        contextBar.setTitle('Industry Listing Details')
    }

    const onComposeMail = () => {
        setModal(
            <GlobalModal>
                <div>
                    <ComposeListingIndustryMail
                        industry={selectedBox}
                        onCancelComposeMail={onCancelComposeMail}
                        workplaceId={workplaceId}
                    />
                </div>
            </GlobalModal>
        )
    }

    const onCancelComposeMail = useCallback(() => {
        setModal(null)
    }, [])

    const toggleCall = () => setShowCall((prev) => !prev)

    return (
        <>
            {modal}
            <ShowErrorNotifications result={addToContactedResult} />
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
                                {true && (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
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
                                    title={industryDetails?.data?.businessName}
                                >
                                    {ellipsisText(
                                        industryDetails?.data?.businessName,
                                        15
                                    ) ?? 'NA'}
                                </h3>
                                {statusData()}
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
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>
                                    {industryDetails?.data?.address ?? 'NA'}
                                </span>
                                {/* <span>•</span>
                                <Users className="h-3 w-3" />
                                <span>industry.studentsPlaced placed</span> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 mt-4 px-2">
                        <Button
                            text={call ? 'Hide' : 'Call'}
                            Icon={LuPhoneCall}
                            variant="primaryNew"
                            onClick={() => {
                                toggleCall()
                                if (!call) {
                                    addToContacted({
                                        studentId:
                                            studentId !== undefined
                                                ? studentId
                                                : Number(router?.query?.id),
                                        industryId,
                                        wpId: workplaceId,
                                        isListing: true,
                                    })
                                    navigator.clipboard.writeText(
                                        industryDetails?.data?.phone
                                    )
                                }
                                callLog({
                                    params: {
                                        receiver: industryDetails?.data?.id,
                                    },
                                }).then((res: any) => {
                                    if (res?.data) {
                                        notification.success({
                                            title: 'Called Industry',
                                            description: `Called Industry with Name: ${industryDetails?.data?.businessName}`,
                                        })
                                    }
                                })
                                notification.success({
                                    title: 'Copied',
                                    description: 'Phone Number Copied',
                                })
                            }}
                            outline
                        />
                        <Button
                            text="Email"
                            Icon={IoDocumentTextOutline}
                            variant="secondary"
                            onClick={onComposeMail}
                            outline
                        />
                    </div>

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
                                //  isListing={ true}
                            />
                        </div>
                    )}

                    <div className="bg-[#044866]/5 rounded-lg p-2 border border-[#044866]/10 mt-2">
                        <div className="flex items-center gap-1 mb-2">
                            <Sparkles className="h-3 w-3 text-[#044866]" />
                            <span className="text-xs font-medium text-[#044866]">
                                Quick Actions
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <Button
                                text="Do not disturb"
                                Icon={FiUserMinus}
                                variant="error"
                                onClick={() =>
                                    onDoNotDisturbClicked(industryDetails?.data)
                                }
                                outline
                            />
                            <Button
                                text="Signup"
                                Icon={FiUserPlus}
                                variant="success"
                                outline
                                onClick={() => {
                                    if (role === UserRoles.SUBADMIN) {
                                        router.push(
                                            '/portals/sub-admin/tasks/industry-listing/signup-future-industry'
                                        )
                                    } else {
                                        router.push(
                                            '/portals/admin/future-industries/signup-future-industry'
                                        )
                                    }
                                }}
                            />
                            {/* <Button
                                text="Apply"
                                Icon={IoDocumentTextOutline}
                                variant="info"
                                outline
                                onClick={() => {
                                    addExistingIndustry({
                                        workplaceId,
                                        industryId: selectedBox?.id,
                                    })
                                }}
                                loading={addExistingIndustryResult.isLoading}
                                disabled={addExistingIndustryResult.isLoading}
                            /> */}
                            <Button
                                text="View"
                                Icon={IoEyeOutline}
                                outline
                                onClick={onViewIndustryListingDetail}
                            />
                        </div>
                    </div>

                    {/* Call */}
                </>
            ) : (
                <NoData text="No data found" />
            )}
        </>
    )
}
