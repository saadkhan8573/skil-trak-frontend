import { MediaQueries } from '@constants'
import { useContextBar } from '@hooks'
import { ImportantDocuments, Supervisor } from '@partials/common'
import { IndustryLocations } from '@partials/common/IndustryProfileDetail/components'
import { SelectAppointmentStatusVII } from '@partials/common/ProfileAppointments/select-appointment-status-v2/SelectAppointmentStatusVII'
import { CommonApi, useIndustryProfileQuery } from '@queries'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
    IndustryDashboardRD,
    IndustryDashboardStudents,
    IndustryDashboardTypeDocs,
    IndustryServices,
    IndustryShiftingHours,
} from './components'
import { IndustryDashboardCB } from './IndustryDashboardCB'
import { EsignDocumentStatus } from '@utils'

export const IndustryUpdatedDashboard = () => {
    const [modal, setModal] = useState<any | null>(null)
    const industry = useIndustryProfileQuery()
    const isMobile = useMediaQuery(MediaQueries.Mobile)

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const contextBar = useContextBar()
    const onClose = () => {
        setModal(null)
    }
    const appointmentCompletion =
        CommonApi.Appointments.useAppointmentCompletionStatusIndustry({})

    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: [EsignDocumentStatus.PENDING, EsignDocumentStatus.ReSign],
            skip: 0,
            limit: 50,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const uponCompletionAppointment = () => {
        setModal(
            <SelectAppointmentStatusVII
                isOpen={true}
                appointment={appointmentCompletion?.data}
                onClose={onClose}
            />
        )
    }

    useEffect(() => {
        const hasPendingDocs =
            pendingDocuments?.isSuccess &&
            pendingDocuments?.data?.data &&
            pendingDocuments?.data?.data?.length > 0

        const isDismissed = contextBar.viewAgreementModal > 0

        if (
            appointmentCompletion?.data &&
            Object.keys(appointmentCompletion?.data).length > 0 &&
            !appointmentCompletion?.data?.isSuccessfull &&
            (isDismissed || (pendingDocuments.isSuccess && !hasPendingDocs))
        ) {
            uponCompletionAppointment()
        }
    }, [
        appointmentCompletion?.data,
        pendingDocuments?.isSuccess,
        pendingDocuments?.data,
        contextBar.viewAgreementModal,
    ])

    useEffect(() => {
        if (industry?.isSuccess && !isMobile) {
            contextBar.setContent(
                <IndustryDashboardCB industry={industry?.data} />
            )
            contextBar.setBgColor('#F7F1E3')
            contextBar.show(false)
        }
        return () => {
            contextBar.setContent(null)
            contextBar.hide()
            contextBar.setBgColor(null)
        }
    }, [industry, mousePosition, isMobile])

    const handleMouseMove = (event: any) => {
        if (!contextBar.content) {
            setMousePosition({ x: event.clientX, y: event.clientY })
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [contextBar])

    return (
        <>
            {modal && modal}
            <div className="flex flex-col gap-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 xl:h-[490px] overflow-hidden">
                    <div className="h-full">
                        <IndustryShiftingHours />
                    </div>
                    <div className="w-full h-full grid grid-cols-1 xl:grid-cols-5 gap-3.5">
                        <div className="lg:col-span-3 h-[490px] ">
                            <IndustryDashboardRD industry={industry?.data} />
                        </div>
                        <div className="lg:col-span-2 h-[490px] ">
                            <IndustryDashboardTypeDocs />
                            {/* <IndustryServices /> */}
                        </div>
                    </div>
                </div>
                <IndustryServices />

                <IndustryDashboardStudents />

                {isMobile ? (
                    <div className="p-8 rounded-[20px] bg-[#F7F1E3]">
                        <IndustryDashboardCB industry={industry?.data} />
                    </div>
                ) : null}
                <ImportantDocuments
                    coureseRequirementsLink={
                        '/portals/industry/course-requirements'
                    }
                />

                <Supervisor industry={industry?.data} />
                <div>
                    <IndustryLocations industry={industry?.data} />
                </div>
            </div>
        </>
    )
}
