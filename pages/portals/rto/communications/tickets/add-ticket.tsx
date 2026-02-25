import { ReactElement, useEffect } from 'react'

// Layouts
import { RtoLayoutV2 } from '@layouts'
// Types
import { BackButton } from '@components'
import { PageHeading } from '@components/headings'
import { useNavbar, useNotification } from '@hooks'
import { AddTicketForm } from '@partials/common/Tickets'
import { CommonApi, RtoApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'
import { BiEnvelope } from 'react-icons/bi'

const AddTicket: NextPageWithLayout = () => {
    const { notification } = useNotification()
    const router = useRouter()

    const [createTicket, createTicketResult] =
        CommonApi.Tickets.useCreateTicket()
    const subadmins = RtoApi.Coordinator.useAssignedCoordinators()
    const studentList = RtoApi.Students.useRtoStudentsList()

    useEffect(() => {
        if (createTicketResult.isSuccess) {
            notification.success({
                title: 'Ticket Created',
                description: 'Ticket Created Successfully',
            })
            router.push(
                `/portals/rto/communications/tickets/${createTicketResult.data?.id}`
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
                    link={'/portals/rto/communications/tickets'}
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
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: BiEnvelope,
                title: 'Create Ticket',
                description: 'Submit a new support ticket to the team',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default AddTicket
