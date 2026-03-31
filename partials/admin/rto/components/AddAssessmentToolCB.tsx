import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

// components
import {
    Typography,
    Button,
    TextInput,
    Select,
    Checkbox,
    ShowErrorNotifications,
} from '@components'

// hoc
import { FileUpload } from '@hoc'

// query
import { useGetSubAdminRTOCoursesQuery, AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { UploadFile } from '@components/inputs/UploadFile'
import { useContextBar, useNotification } from '@hooks'
import { RtoAssessmentToolFormType, User } from '@types'
import { omit } from 'lodash'
import { CourseSelectOption, formatOptionLabel } from '@utils'
type Props = {
    edit?: boolean
    assessment?: any
    rtoUser: User
}

export const AddAssessmentToolCB = ({ edit, assessment, rtoUser }: Props) => {
    const [coursesOptions, setCoursesOptions] = useState<any | null>([])
    const [fileData, setFileData] = useState<any | null>([])

    const { notification } = useNotification()
    const contextBar = useContextBar()

    const router = useRouter()
    const rtoId = router.query.id
    const rtoCourses = useGetSubAdminRTOCoursesQuery(Number(rtoId), {
        skip: !rtoId,
    })
    const [create, createResult] = AdminApi.Rtos.useCreateAssessmentTools()
    const [update, updateResult] = AdminApi.Rtos.useUpdateAssessmentTools()
    useEffect(() => {
        if (rtoCourses?.data && rtoCourses.isSuccess) {
            const options = rtoCourses?.data?.map((course: any) => ({
                label: course.title,
                value: course.id,
                item: course,
            }))
            setCoursesOptions(options)
        }
    }, [rtoCourses])

    useEffect(() => {
        if (createResult.isSuccess) {
            notification.success({
                title: 'Assessment Tools Added',
                description: 'Assessment Tool Added Successfully',
            })
            contextBar.setContent(null)
            contextBar.hide()
        }
        if (updateResult.isSuccess) {
            notification.info({
                title: 'Assessment Tools Updated',
                description: 'Assessment Tool Updated Successfully',
            })
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [createResult, updateResult])

    const assessmentValues = {
        title: assessment?.title,
        isStudentLogBook: assessment?.isStudentLogBook,
        isIndustryLogBook: assessment?.isIndustryLogBook,
    }

    const methods = useForm<RtoAssessmentToolFormType>({
        mode: 'all',
        defaultValues: assessmentValues,
    })

    const onSubmit = async (values: RtoAssessmentToolFormType) => {
        // delete values.file
        const valuesWithoutFile = omit(
            values,
            'file',
            'isStudentLogBook',
            'isIndustryLogBook'
        )
        const formData = new FormData()
        formData.append('file', fileData)
        Object.entries(valuesWithoutFile).map(([key, value]) => {
            formData.append(key, value as string)
        })
        if (values?.isStudentLogBook) {
            formData.append('isStudentLogBook', 'true')
        }
        if (values?.isIndustryLogBook) {
            formData.append('isIndustryLogBook', 'true')
        }
        edit
            ? update({ body: formData, assessment: assessment?.id })
            : create({ body: formData, id: Number(rtoId) })
    }
    return (
        <div>
            <ShowErrorNotifications result={createResult} />
            <ShowErrorNotifications result={updateResult} />
            <Typography variant={'small'} color={'text-gray-500'}>
                {edit ? 'Edit' : 'Add'} Assessment To:
            </Typography>
            <Typography variant={'label'}>{rtoUser?.name}</Typography>
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="">
                        {edit ? (
                            <>
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-600'}
                                >
                                    Course
                                </Typography>
                                <Typography
                                    variant={'label'}
                                    color={'text-gray-800'}
                                >
                                    {assessment?.course?.title}
                                </Typography>
                            </>
                        ) : (
                            <Select
                                name="course"
                                label="Course(s)"
                                placeholder="Select Your Choice"
                                options={coursesOptions}
                                loading={rtoCourses.isLoading}
                                disabled={rtoCourses.isLoading}
                                onlyValue
                                components={{ Option: CourseSelectOption }}
                                formatOptionLabel={formatOptionLabel}
                            />
                        )}
                        <TextInput
                            label={'Title'}
                            name={'title'}
                            placeholder={'Your Title Here...'}
                            validationIcons
                            required
                        />
                        <Checkbox
                            name="isStudentLogBook"
                            label={'Logbook for Student'}
                        />
                        <Checkbox
                            name="isIndustryLogBook"
                            label={'Logbook for Industry'}
                        />
                        <FileUpload
                            onChange={(docs: any) => {
                                setFileData(docs)
                                // const formData = new FormData()
                                // docs.forEach((doc: any) => {
                                //     formData.append('assessmentEvidence', doc)
                                // })
                                // uploadDocs({
                                //     id: folder?.id,
                                //     body: formData,
                                // })
                            }}
                            name={'file'}
                            component={UploadFile}
                            // acceptTypes={getDocType()}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        {edit ? (
                            <Button
                                submit
                                disabled={createResult.isLoading}
                                loading={createResult.isLoading}
                            >
                                Update Assessment
                            </Button>
                        ) : (
                            <Button
                                submit
                                disabled={
                                    createResult.isLoading ||
                                    updateResult?.isLoading
                                }
                                loading={
                                    createResult.isLoading ||
                                    updateResult?.isLoading
                                }
                            >
                                Add Assessment
                            </Button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
