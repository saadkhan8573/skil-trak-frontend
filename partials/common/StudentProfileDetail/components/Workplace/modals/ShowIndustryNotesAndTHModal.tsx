import {
    Button,
    Checkbox,
    GlobalModal,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification, useWorkplace } from '@hooks'
import { IndustryShiftingHours } from '@partials/common/IndustryProfileDetail/components'
import { useAddExistingIndustriesMutation } from '@queries'
import { ReactElement, useEffect, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { IndustryPinnedNotes } from '../components'
import { WorkplaceErrorMessage } from '../enum'
import { InsuranceDocMisMatchModal } from './InsuranceDocMisMatchModal'
import { PlacementOutSIde20KmModal } from './PlacementOutSIde20KmModal'
import { SelectAppointDateModal } from './SelectAppointDateModal'
import { TradingHoursNotFoundModal } from './TradingHoursNotFoundModal'
import { WorkplaceTypeNotFoundModal } from './WorkplaceTypeNotFoundModal'
import { WorkplaceTypeMisMatchModal } from './WorkplaceTypeMisMatchModal'
import { WpServiceOfferedMisMatchModal } from './WpServiceOfferedMisMatchModal'

export const ShowIndustryNotesAndTHModal = ({
    industryCapacity,
    industryUserName,
    onCancel,
    industryUserId,
    workplaceId,
    industryId,
    type,
}: {
    industryCapacity?: number
    industryUserName: string
    industryUserId: number
    industryId: number
    workplaceId: number
    onCancel: (val?: boolean) => void
    type?: string
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [isWithoutAppointmentDates, setIsWithoutAppointmentDates] =
        useState<boolean>(false)

    const { notification } = useNotification()
    const { workplaceData, setWorkplaceData } = useWorkplace()

    const [addExistingIndustry, addExistingIndustryResult] =
        useAddExistingIndustriesMutation()

    const onCancelInnerModal = () => setModal(null)

    useEffect(() => {
        if (workplaceData?.type === WorkplaceErrorMessage.DOCS_MISMATCH) {
            setModal(
                <InsuranceDocMisMatchModal
                    {...workplaceData?.dates}
                    {...{ workplaceId, industryId }}
                    onCancel={onCancelInnerModal}
                    industryName={industryUserName}
                    rtoName={workplaceData?.rtoName}
                    missingDocuments={workplaceData?.missingDocuments}
                    branch={workplaceData?.branch}
                />
            )
            setWorkplaceData(null)
        }
        if (workplaceData?.type === 'placementOutSide20Km') {
            setModal(
                <PlacementOutSIde20KmModal
                    {...workplaceData?.dates}
                    {...{ workplaceId, industryId }}
                    onCancel={onCancelInnerModal}
                    industryName={industryUserName}
                    rtoName={workplaceData?.rtoName}
                    missingDocuments={workplaceData?.missingDocuments}
                    branch={workplaceData?.branch}
                />
            )
            setWorkplaceData(null)
        }
        if (
            workplaceData?.type ===
            WorkplaceErrorMessage.TRADING_HOURS_NOT_FOUND
        ) {
            setModal(
                <TradingHoursNotFoundModal onCancel={onCancelInnerModal} />
            )
            setWorkplaceData(null)
        }

        if (workplaceData?.type === WorkplaceErrorMessage.WP_TYPE_NOT_FOUND) {
            setModal(
                <WorkplaceTypeNotFoundModal
                    onCancel={onCancelInnerModal}
                    industryName={industryUserName}
                    industryUserId={industryUserId}
                />
            )
            setWorkplaceData(null)
        }
        if (
            workplaceData?.type ===
            WorkplaceErrorMessage.WP_SERVICE_OFFERED_MISMATCH
        ) {
            setModal(
                <WpServiceOfferedMisMatchModal
                    onCancel={onCancelInnerModal}
                    message={workplaceData?.message}
                />
            )
            setWorkplaceData(null)
        }
    }, [workplaceData])

    const onCancelClicked = () => setModal(null)
    const onApply = async () => {
        // if (dist <= 20) {
        const payload: any = {
            workplaceId,
            industryId,
        }

        if (type) {
            payload.branch = type
        }
        const res: any = await addExistingIndustry(payload)
        if (res?.data) {
            notification.success({
                title: 'Industry Added Successfully',
                description: 'Industry Added Successfully',
            })

            onCancel()
        }

        if (res?.error?.data?.message === WorkplaceErrorMessage.LIMIT_EXCEED) {
            setWorkplaceData({
                name: industryUserName,
                industryCapacity,
                type: WorkplaceErrorMessage.LIMIT_EXCEED,
                branch: type,
            })
        }
        if (res?.error?.data?.message === WorkplaceErrorMessage.DOCS_MISMATCH) {
            setWorkplaceData({
                type: WorkplaceErrorMessage.DOCS_MISMATCH,
                rtoName: res?.error?.data?.rtoName,
                missingDocuments: res?.error?.data?.missingDocuments,
                branch: type,
            })
        }
        if (
            res?.error?.data?.message ===
            WorkplaceErrorMessage.DISTANCE_EXCEEDED_LIMIT
        ) {
            setWorkplaceData({
                type: 'placementOutSide20Km',
                branch: type,
            })
        }
        if (
            res?.error?.data?.message ===
            WorkplaceErrorMessage.TRADING_HOURS_NOT_FOUND
        ) {
            setWorkplaceData({
                type: WorkplaceErrorMessage.TRADING_HOURS_NOT_FOUND,
                branch: type,
            })
        }
        if (
            res?.error?.data?.message ===
            WorkplaceErrorMessage.WP_TYPE_NOT_FOUND
        ) {
            setWorkplaceData({
                type: WorkplaceErrorMessage.WP_TYPE_NOT_FOUND,
                branch: type,
            })
        }
        if (
            res?.error?.data?.message ===
            WorkplaceErrorMessage.WP_TYPE_MIS_MATCH
        ) {
            setWorkplaceData({
                type: WorkplaceErrorMessage.WP_TYPE_MIS_MATCH,
                branch: type,
            })
        }
        if (
            res?.error?.data?.message.startsWith(
                'The selected industry does not offer'
            )
        ) {
            setWorkplaceData({
                type: WorkplaceErrorMessage.WP_SERVICE_OFFERED_MISMATCH,
                branch: type,
                message: res?.error?.data?.message,
            })
        }
    }

    return (
        <>
            {modal}
            <ShowErrorNotifications result={addExistingIndustryResult} />
            <GlobalModal>
                <div className="relative w-full lg:max-w-5xl h-full p-2">
                    <MdCancel
                        onClick={() => {
                            onCancel()
                        }}
                        className="absolute top-2 right-2 transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />
                    <div className="py-2 border-b">
                        <Typography bold>{industryUserName}</Typography>
                    </div>
                    <div className="grid grid-cols-5 divide-x-2 h-[380px] overflow-auto custom-scrollbar">
                        <div className="col-span-3">
                            <IndustryShiftingHours
                                showTitle={false}
                                industryUserId={industryUserId}
                            />
                        </div>
                        <div className="col-span-2">
                            <IndustryPinnedNotes
                                industryUserId={industryUserId}
                            />
                        </div>
                    </div>

                    {/*  */}
                    <div className="py-3 flex flex-col gap-y-2">
                        <Checkbox
                            name="check"
                            onChange={(e: any) => {
                                setIsChecked(e?.target?.checked)
                            }}
                            label={
                                <>
                                    I hereby confirm that I have thoroughly
                                    reviewed and understood all pinned notes and
                                    the official trading hours of{' '}
                                    <strong>{industryUserName}</strong>.
                                </>
                            }
                            showError={false}
                        />
                        {/* <Checkbox
                            name="appointmentDates"
                            onChange={(e: any) => {
                                setIsWithoutAppointmentDates(e?.target?.checked)
                            }}
                            label={<>Continue without appointment dates</>}
                            showError={false}
                        /> */}
                        <div className={'flex items-center gap-x-4  '}>
                            <Button
                                text="Cancel"
                                variant="error"
                                onClick={() => {
                                    onCancel()
                                }}
                            />

                            <Button
                                text={'Proceed'}
                                variant="success"
                                onClick={() => {
                                    // if (isWithoutAppointmentDates) {
                                    onApply()
                                    // } else {
                                    // setModal(
                                    //     <SelectAppointDateModal
                                    //         onCancel={onCancelClicked}
                                    //         industryId={industryId}
                                    //         industryUserName={
                                    //             industryUserName
                                    //         }
                                    //         industryCapacity={Number(
                                    //             industryCapacity
                                    //         )}
                                    //         branch={type}
                                    //         workplaceId={workplaceId}
                                    //     />
                                    // )
                                    // }
                                }}
                                loading={addExistingIndustryResult?.isLoading}
                                disabled={
                                    addExistingIndustryResult?.isLoading ||
                                    !isChecked
                                }
                            />
                        </div>
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}
