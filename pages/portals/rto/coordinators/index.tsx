import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
// Layouts
import { RtoLayout } from '@layouts'
import { NextPageWithLayout } from '@types'
//components
import { Button, PageTitle, TabNavigation, TabProps } from '@components'
// queries
// Link
// React icons
import { useJoyRide } from '@hooks'
import {
    AssignedCoordinators,
    MyCoordinators,
} from '@partials/rto/coordinators'

type Props = {}

const RtoCoordinators: NextPageWithLayout = (props: Props) => {
    const router = useRouter()

    // ADD COORDINATOR JOY RIDE - START
    const joyride = useJoyRide()
    useEffect(() => {
        if (joyride.state.tourActive) {
            setTimeout(() => {
                joyride.setState({ ...joyride.state, run: true, stepIndex: 1 })
            }, 1200)
        }
    }, [])

    const tabs: TabProps[] = [
        {
            label: 'My Coordinators',
            href: {
                pathname: 'coordinators',
                query: { tab: 'my-coordinators' },
            },
            element: <MyCoordinators />,
        },
        {
            label: 'Assigned Coordinators',
            href: {
                pathname: 'coordinators',
                query: { tab: 'assigned-coordinators' },
            },
            element: <AssignedCoordinators />,
        },
    ]

    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <PageTitle title="Coordinators" backTitle="Users" />
                <div id="add-coordinator">
                    <Button
                        text="+ Add Coordinator"
                        onClick={() => {
                            router.push('coordinators/create')
                        }}
                    />
                </div>
            </div>
            <TabNavigation tabs={tabs}>
                {({ header, element }: any) => (
                    <div>
                        <div>{header}</div>
                        <div className="mt-3">{element}</div>
                    </div>
                )}
            </TabNavigation>
            {/* <div className="mt-6 flex justify-between">
                <HelpQuestionSet
                    title={'What you want to do here?'}
                    questions={RelatedQuestions}
                />

                <HelpQuestionSet
                    title={'What else you want to do?'}
                    questions={OtherQuestions}
                />
            </div> */}
        </div>
    )
}
RtoCoordinators.getLayout = (page: ReactElement) => {
    return <RtoLayout>{page}</RtoLayout>
}

export default RtoCoordinators
