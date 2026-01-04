import { Button, GlobalModal, LoadingAnimation, NoData } from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { SubAdminApi } from '@queries'
import { getUserCredentials } from '@utils'

import { FaCheckCircle } from 'react-icons/fa'
import { LiaTimesSolid } from 'react-icons/lia'

export const WpConfirmCapacity = ({
    wpReqApproval,
    onCancel,
}: {
    wpReqApproval: any
    onCancel: () => void
}) => {
    const { notification } = useNotification()
    const [confirmWpCapacity, confirmWpCapacityResult] =
        SubAdminApi.Student.confirmWpCapacity()
    const wpTypes = SubAdminApi.Student.studentRtoWpTypes({
        courseId: wpReqApproval?.courseId,
        rtoId: wpReqApproval?.student?.rto?.id,
    })
    const role = getUserCredentials()?.role
    const wpReqId =
        role === UserRoles.RTO
            ? wpReqApproval?.workplaceApprovaleRequest?.[0]?.id
            : wpReqApproval.id
    // Static workplace types data
    const workplaceTypes = [
        'Corporate Office',
        'Manufacturing Plant',
        'Healthcare Facility',
        'Retail Store',
        'Construction Site',
        'Educational Institution',
        'Restaurant & Hospitality',
        'Technology Hub',
        'Logistics & Warehouse',
        'Research Laboratory',
    ]

    const onConfirmUClicked = async (wpReqApproval: any) => {
        const res: any = await confirmWpCapacity(Number(wpReqId))
        if (res?.data) {
            notification.success({
                title: `Capacity Confirmed`,
                description: `Capacity Confirmed Successfully.`,
            })
            onCancel()
        }
    }

    return (
        <GlobalModal className="relative">
            <LiaTimesSolid
                size={20}
                onClick={onCancel}
                className="ml-auto absolute top-2 right-2 transition-all duration-500 text-gray-700 hover:text-black text-3xl cursor-pointer hover:rotate-90"
            />

            <div className="bg-white modal-animation rounded-2xl flex flex-col items-center gap-y-6 shadow-xl w-full sm:w-auto sm:min-w-[450px] px-16 py-2">
                <div className={`text-orange-500`}>
                    <FaCheckCircle size={48} />
                </div>

                <div className="flex flex-col items-center gap-y-2">
                    <p className="text-lg font-semibold">Are you sure!</p>
                    <div
                        className={`whitespace-normal text-gray-500 max-w-[400px] text-center`}
                    >
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">
                                You are about to confirm wp capacity for the
                                following workplace types:
                            </p>

                            {/* Beautiful List with Check Icons */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl py-2 px-6 border border-green-200 shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                                    Workplace Types
                                </h4>
                                <ul className="space-y-1.5 max-h-36 overflow-auto">
                                    {wpTypes?.isError ? (
                                        <NoData
                                            simple
                                            text="There is some technical error!"
                                        />
                                    ) : null}
                                    {wpTypes?.isLoading ? (
                                        <LoadingAnimation size={35} />
                                    ) : wpTypes?.data &&
                                      wpTypes?.data?.length > 0 ? (
                                        wpTypes?.data?.map((type, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-3 group hover:translate-x-1 transition-transform duration-200"
                                            >
                                                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:bg-green-600 transition-all duration-200">
                                                    <FaCheckCircle className="text-white text-xs" />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                                                    {type?.workplaceType?.name}
                                                </span>
                                            </li>
                                        ))
                                    ) : wpTypes?.isSuccess ? (
                                        <NoData
                                            simple
                                            text="There is no workplace type!"
                                        />
                                    ) : null}
                                </ul>
                            </div>

                            <p className="text-gray-600 mt-4 text-sm">
                                Do you wish to continue?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-x-4 items-center">
                    <Button
                        text="Cancel"
                        variant="secondary"
                        onClick={() => {
                            onCancel && onCancel()
                        }}
                    />
                    <Button
                        text={'Confirm'}
                        onClick={() => {
                            onConfirmUClicked(wpReqApproval)
                        }}
                        loading={confirmWpCapacityResult?.isLoading}
                        disabled={confirmWpCapacityResult?.isLoading}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}
