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
    const [update, updateResult] = useUpdateRtoSubAdminAssessmentToolsMutation()
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

    const onSubmit = async (values: any) => {
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

        create(formData)
    }

    return (
        <div>
            {/* <Typography variant={'small'} color={'text-gray-500'}>
                Add Assessment
            </Typography> */}
            {/* <Typography variant={'label'}>Job Training Organization</Typography> */}
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
                            name="isStudentLogBook"
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
