import { ReactElement, useEffect } from 'react'

// Layouts
import { AdminLayout } from '@layouts'
// Types
import {
    BackButton,
    ShowErrorNotifications
} from '@components'
import { PageHeading } from '@components/headings'
import { useNavbar, useNotification } from '@hooks'
import { AddTicketForm } from '@partials/common/Tickets'
import { AdminApi, CommonApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'

const AddTicket: NextPageWithLayout = () => {
    const { setTitle } = useNavbar()
    const { notification } = useNotification()
    const router = useRouter()

    const subadmins = AdminApi.Workplace.subadminForAssignWorkplace()
    const [createTicket, createTicketResult] =
        CommonApi.Tickets.useCreateTicket()

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
                `/portals/admin/tickets/detail/${createTicketResult.data?.id}`
            )
        }
    }, [createTicketResult])

    const onSubmit = (values: any) => {
        createTicket({ ...values })
    }

    const adminAllStudents =
        CommonApi.Messages.useSearchBulkMailStudents(undefined)

    return (
        <>
            <ShowErrorNotifications result={createTicketResult} />
            <div className="px-4">
                <div className="mt-4">
                    <BackButton
                        text={'Ticket'}
                        link={'/portals/admin/tickets'}
                    />
                    <PageHeading
                        title={'Create New Ticket'}
                        subtitle={'You can add Ticket here'}
                    ></PageHeading>
                </div>

                <AddTicketForm
                    onSubmit={onSubmit}
                    subadmins={subadmins}
                    result={createTicketResult}
                    students={adminAllStudents}
                />
            </div>
        </>
    )
}

AddTicket.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AddTicket
