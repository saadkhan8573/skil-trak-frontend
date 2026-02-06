import { ReactElement, useEffect, useState } from 'react'

import {
    BackButton,
    Card,
    ShowErrorNotifications,
    draftToHtmlText,
} from '@components'
import { PageHeading } from '@components/headings'
import { useAlert, useNavbar } from '@hooks'
import { AdminLayout } from '@layouts'
import { CourseForm } from '@partials/admin/sector/form'
import { AdminApi } from '@queries'
import { NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'

const CourseAddPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { alert } = useAlert()
    const navBar = useNavbar()

    const [add, addResult] = AdminApi.Courses.useAddMutation()
    const [requirementFile, setRequirementFile] = useState<any>(null)

    useEffect(() => {
        navBar.setTitle('Courses')

        return () => {
            navBar.setTitle('')
        }
    }, [])

    const onSubmit = async (values: any) => {
        // const requirements = draftToHtmlText(values?.requirements)
        const body = {
            ...values,
            // requirements,
        }
        await add(body)
    }

    useEffect(() => {
        if (!addResult.isUninitialized) {
            if (addResult.isSuccess) {
                router.push('/portals/admin/sectors?tab=courses')
                alert.success({
                    title: 'Course Added',
                    description: 'A new course has been created',
                })
            }
        }
    }, [addResult])

    return (
        <>
            <ShowErrorNotifications result={addResult} />
            <div className="p-6 flex flex-col gap-y-4 mb-32">
                <BackButton text="Courses" />
                <PageHeading
                    title={'Add Course'}
                    subtitle={`You are creating a course`}
                ></PageHeading>
                <Card>
                    <CourseForm
                        result={addResult}
                        onSubmit={onSubmit}
                    />
                </Card>
            </div>
        </>
    )
}

CourseAddPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default CourseAddPage
