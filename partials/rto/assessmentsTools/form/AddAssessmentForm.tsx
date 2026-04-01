import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

// components
import { Button, Checkbox, Select, TextInput, UploadFile } from '@components'
// hoc
import { FileUpload } from '@hoc'

// query
import { useContextBar, useNotification } from '@hooks'
import {
    useCreateRtoAssessmentToolsMutation,
    useUpdateRtoSubAdminAssessmentToolsMutation,
} from '@queries'
type Props = {
    edit?: boolean
    assessment?: any
    courses: any
}
export const AddAssessmentForm = ({ edit, assessment, courses }: Props) => {
    const [coursesOptions, setCoursesOptions] = useState<any | null>([])
    const [fileData, setFileData] = useState<any | null>([])

    const { notification } = useNotification()
    const contextBar = useContextBar()

    const [create, createResult] = useCreateRtoAssessmentToolsMutation()

    useEffect(() => {
        if (courses?.data && courses.isSuccess) {
            const options = courses?.data?.map((course: any) => ({
                label: course.title,
                value: course.id,
            }))
            setCoursesOptions(options)
        }
    }, [courses])

    useEffect(() => {
        if (createResult.isSuccess) {
            notification.success({
                title: 'Assessment Added',
                description: 'Assessment Added Successfully',
            })
            contextBar.setContent(null)
            contextBar.hide()
        }
    }, [createResult])

    const methods = useForm({
        mode: 'all',
        defaultValues: assessment,
    })

    const isLogBook = methods.watch('isLogBook')
    const isIndustryLogBook = methods.watch('isIndustryLogBook')

    useEffect(() => {
        if (isLogBook) {
            methods.setValue('isIndustryLogBook', false)
        }
    }, [isLogBook, methods])

    useEffect(() => {
        if (isIndustryLogBook) {
            methods.setValue('isLogBook', false)
        }
    }, [isIndustryLogBook, methods])

    const onSubmit = async (values: any) => {
        const valuesWithoutFile = omit(
            values,
            'file',
            'isLogBook',
            'isIndustryLogBook'
        )

        const formData = new FormData()
        formData.append('file', fileData)
        Object.entries(valuesWithoutFile).map(([key, value]) => {
            formData.append(key, value as string)
        })
        if (values?.isLogBook) {
            formData.append('isLogBook', 'true')
        }
        if (values?.isIndustryLogBook) {
            formData.append('isIndustryLogBook', 'true')
        }

        create(formData)
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form
                    className="mt-2 w-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <div className="">
                        <Select
                            name="course"
                            label="Course(s)"
                            placeholder="Select Your Choice"
                            options={coursesOptions}
                            loading={courses.isLoading}
                            disabled={courses.isLoading}
                            onlyValue
                        />
                        <TextInput
                            label={'Title'}
                            name={'title'}
                            placeholder={'Your Title Here...'}
                            validationIcons
                            required
                        />
                        <Checkbox
                            name="isLogBook"
                            label={'Logbook for Student'}
                        />
                        <Checkbox
                            name="isIndustryLogBook"
                            label={'Logbook for Industry'}
                        />
                        <FileUpload
                            name={'file'}
                            component={UploadFile}
                            onChange={(e: any) => {
                                setFileData(e)
                            }}
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
                                disabled={createResult.isLoading}
                                loading={createResult.isLoading}
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
