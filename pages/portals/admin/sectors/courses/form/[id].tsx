import { ReactElement, useEffect, useState } from 'react'

import {
    BackButton,
    Card,
    LoadingAnimation,
    Popup,
    ShowErrorNotifications,
} from '@components'
import { PageHeading } from '@components/headings'
import { useAlert, useNavbar, useNotification } from '@hooks'
import { AdminLayout } from '@layouts'
import { CourseForm, SectorForm } from '@partials/admin/sector/form'
import { AdminApi } from '@queries'
import { Course, NextPageWithLayout } from '@types'
import { useRouter } from 'next/router'

const CourseEditPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { alert } = useAlert()
    const { notification } = useNotification()
    const navBar = useNavbar()
    const id = Number(router.query?.id || -1)

    const [update, updateResult] = AdminApi.Courses.useUpdateMutation()
    const { data, isLoading, isSuccess } = AdminApi.Courses.useDetailQuery(id, {
        skip: !id,
    })

    const [requirementFile, setRequirementFile] = useState<any>(null)

    useEffect(() => {
        navBar.setTitle('Edit Course')
    }, [])

    useEffect(() => {
        if (isSuccess && data) {
            setRequirementFile(data?.requirements)
        }
    }, [data, isSuccess])

    const onSubmit = async (values: any) => {
        // const requirements = draftToHtmlText(values?.requirements)
        const body = {
            ...values,
            // requirements,
            id,
        }
        await update(body)
    }

    useEffect(() => {
        if (!updateResult.isUninitialized) {
            if (updateResult.isSuccess) {
                router.push('/portals/admin/sectors?tab=courses')
                alert.info({
                    title: 'Course Updated',
                    description: `Course '${data?.title}' has been updated`,
                })
            }
        }
    }, [updateResult])

    return (
        <>
            <ShowErrorNotifications result={updateResult} />
            <div className="p-6 flex flex-col gap-y-4">
                <BackButton text="Courses" />
                <PageHeading
                    title="Edit Course"
                    subtitle={`You are editing a course`}
                ></PageHeading>
                <Card>
                    {data && !isLoading ? (
                        <CourseForm
                            edit
                            onSubmit={onSubmit}
                            initialValues={data}
                            result={updateResult}
                        />
                    ) : (
                        <LoadingAnimation />
                    )}
                </Card>
            </div>
        </>
    )
}

CourseEditPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default CourseEditPage
