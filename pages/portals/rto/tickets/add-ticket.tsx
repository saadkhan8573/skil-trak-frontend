import { ReactElement, useEffect } from 'react'

// Layouts
import { RtoLayout, SubAdminLayout } from '@layouts'
// Types
import { BackButton, draftToHtmlText } from '@components'
import { PageHeading } from '@components/headings'
import { useNavbar, useNotification } from '@hooks'
import { AddTicketForm } from '@partials/common/Tickets'
import { NextPageWithLayout } from '@types'
import { AdminApi, CommonApi, RtoApi, SubAdminApi } from '@queries'
import { useRouter } from 'next/router'

const AddTicket: NextPageWithLayout = () => {
    const { setTitle } = useNavbar()
    const { notification } = useNotification()
    const router = useRouter()

    const [createTicket, createTicketResult] =
        CommonApi.Tickets.useCreateTicket()
    const subadmins = RtoApi.Coordinator.useAssignedCoordinators()
    const studentList = RtoApi.Students.useRtoStudentsList()

    useEffect(() => {
        setTitle('Add Tickets')
    }, [])

    useEffect(() => {
        if (createTicketResult.isSuccess) {
            notification.success({
                title: 'Ticket Created',
                description: 'Ticket Created Successfully',
            })
            router.push(
                `/portals/rto/tickets/detail/${createTicketResult.data?.id}`
            )
        }
    }, [createTicketResult])

    const onSubmit = (values: any) => {
        createTicket({ ...values })
    }

    return (
        <div className="px-4">
            <div className="mt-4">
                <BackButton
                    text={'Ticket'}
                    link={'/portals/sub-admin/tickets'}
                />
                <PageHeading
                    title={'Create New Ticket'}
                    subtitle={'You can add Ticket here'}
                ></PageHeading>
            </div>

            <AddTicketForm
                onSubmit={onSubmit}
                subadmins={subadmins}
                students={studentList}
                result={createTicketResult}
            />
        </div>
    )
}

AddTicket.getLayout = (page: ReactElement) => {
    return <RtoLayout>{page}</RtoLayout>
}

export default AddTicket
