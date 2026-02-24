import {
    Button,
    Checkbox,
    GlobalModal,
    ShowErrorNotifications,
    Typography,
} from '@components'
import { useNotification } from '@hooks'
import { RateCoordinatorModal } from '@partials/common'
import { StudentApi, SubAdminApi } from '@queries'
import { ReactElement, useEffect, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { WPApprovalStatus } from '../enum'

export const WorkplaceApprovalDeclaration = ({
    onCancel,
    declaration,
    wpApprovalId,
    rData,
    subAdminUserId,
}: {
    rData: {
        status: string
        date: string
    }
    wpApprovalId: number
    declaration: string
    onCancel: (val?: boolean) => void
    subAdminUserId?: any
}) => {
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [reqData, setReqData] = useState<{
        status: string
        date: string
    }>(
        {} as {
            status: string
            date: string
        }
    )

    const { notification } = useNotification()
    const changeWpApprovalReq = StudentApi.Workplace.changeStatusWpApprroval(
        { id: wpApprovalId, ...reqData },
        {
            skip: !Object.values(reqData)?.length,
        }
    )

    const [changeStatus, changeStatusResult] =
        SubAdminApi.Workplace.changeWpReqStatus()

    useEffect(() => {
        if (changeStatusResult.isSuccess) {
            notification.success({
                title: 'Status Changed',
                description: 'Status Changed Successfully',
            })
            onCancel(true)
        }
    }, [changeStatusResult])

    const onChangeStatusClicked = async (status: WPApprovalStatus) => {
        try {
            const res: any = await changeStatus({
                id: wpApprovalId,
                status,
            }).unwrap() // await the API
            console.log('res', res)

            if (res?.data) {
                notification.success({
                    title: 'Status Changed',
                    description: 'Status Changed Successfully',
                })

                onCancel(true)
                console.log('triggered')
            }
        } catch (error) {
            console.error('Error changing status:', error)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={changeStatusResult} />
            <GlobalModal>
                <div className="relative max-w-5xl w-full">
                    <MdCancel
                        onClick={() => {
                            onCancel()
                        }}
                        className="absolute -top-1 -right-1 transition-all duration-500 text-black hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />
                    <div className="flex flex-col gap-y-2.5 p-3">
                        <Typography
                            capitalize
                            color="text-[#24556D]"
                            variant="subtitle"
                            bold
                        >
                            Student Placement Declaration
                        </Typography>

                        <div
                            className="border rounded p-2 bg-[#F7910F26] h-40 md:h-80 xl:h-auto custom-scrollbar overflow-auto"
                            style={{
                                fontSize: '85%',
                                // lineHeight: '25px',
                            }}
                        >
                            <span
                                className="content-editor list-style-inside"
                                dangerouslySetInnerHTML={{
                                    __html: declaration,
                                }}
                            />
                        </div>
                        <Checkbox
                            name={'agreedWithPrivacyPolicy'}
                            label={
                                'I have read, understood, and agree to the terms and conditions outlined in the above declaration'
                            }
                            onChange={(e: any) =>
                                setIsChecked(e?.target?.checked)
                            }
                            showError={false}
                        />
                        <Button
                            onClick={() => {
                                if (rData) {
                                    setReqData(rData)
                                } else {
                                    onChangeStatusClicked(
                                        WPApprovalStatus.Approved
                                    )
                                }
                            }}
                            text="Approve"
                            loading={
                                changeStatusResult.isLoading ||
                                changeWpApprovalReq.isLoading
                            }
                            disabled={
                                changeStatusResult.isLoading ||
                                changeWpApprovalReq.isLoading ||
                                !isChecked
                            }
                            variant="success"
                        />
                    </div>
                </div>
            </GlobalModal>
        </>
    )
}
