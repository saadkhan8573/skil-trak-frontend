import { Button, Select, TextInput } from '@components'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Course, ImportStudentFormType } from '@types'
import { CourseSelectOption, formatOptionLabel, getDate } from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormProps {
    onSubmit: (values: ImportStudentFormType) => void
    edit?: boolean
    initialValues?: any
    onStudentFound: Function
    setEmailExistList: Function
    result: any
    rtoCourses: any
}
export const ImportStudentForm = ({
    result,
    onSubmit,
    edit,
    initialValues,
    onStudentFound,
    setEmailExistList,
    rtoCourses,
}: FormProps) => {
    const { notification } = useNotification()
    const [mount, setMount] = useState(false)
    const [studentsCount, setStudentsCount] = useState<number>(0)

    const router = useRouter()

    useEffect(() => {
        if (!mount) setMount(true)
    }, [])

    const courses = AdminApi.Courses.useListQuery({
        limit: 100,
        skip: 0,
        search: '',
    })
    const [courseOptions, setCourseOptions] = useState<any>([])

    const onSectorSelect = (options: any) => {
        const currentSelectedSectors = options.map((opt: any) => opt.value)

        const currentSelectableCourses: any = []
        currentSelectedSectors.forEach((sectorId: number) => {
            const currentCourses = courses.data?.data.filter(
                (c) => c.sector.id === sectorId
            )

            if (currentCourses?.length)
                currentSelectableCourses.push(...currentCourses)
        })

        setCourseOptions(
            currentSelectableCourses.map((c: any) => ({
                label: c.title,
                value: c.id,
            }))
        )
    }

    const validationSchema = yup.object({
        batch: yup.string().required('Batch required'),
        expiryDate: yup.string().required('Expiry required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: 'all',
    })

    const onFileChange = async (e: any, fileData: any) => {
        try {
            const { read, utils } = await import('xlsx')
            const wb = read(e.target.result, { type: 'binary' })
            const sheets = wb.SheetNames

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
                setStudentsCount(rows?.length)
                if (rows?.length <= 50) {
                    onStudentFound && onStudentFound(rows, fileData)
                } else {
                    notification.error({
                        title: 'Student Length!',
                        description:
                            'Student Length must be less then or equal to 50!',
                        dissmissTimer: 5000,
                    })
                }
            }
        } catch (err) {
            notification.error({
                title: 'Invalid File',
                description: 'File should be .csv or .xlsx',
            })
        }
    }

    return (
        <FormProvider {...methods}>
            <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className={'flex gap-4'}>
                    <div className="w-3/5">
                        <div className="grid grid-cols-2 gap-2">
                            <TextInput
                                name="batch"
                                label={'Batch/Class'}
                                placeholder={'Batch/Class'}
                            />
                            <TextInput
                                label={'Expiry Date'}
                                name="expiryDate"
                                type="date"
                                min={getDate()}
                            />
                        </div>

                        <div className="mb-2 -mt-3">
                            <div className="grid  gap-2">
                                {/* <Select
                                    name={'sectors'}
                                    label={'Sector'}
                                    options={
                                        sectors.isLoading
                                            ? []
                                            : sectors.data?.data.map((s) => ({
                                                  label: s.name,
                                                  value: s.id,
                                              }))
                                    }
                                    onChange={(option: any) =>
                                        onSectorSelect(option)
                                    }
                                    loading={sectors.isLoading}
                                    multi
                                /> */}

                                <Select
                                    name={'courses'}
                                    label={'Courses'}
                                    options={rtoCourses}
                                    multi
                                    onlyValue
                                    components={{ Option: CourseSelectOption }}
                                    formatOptionLabel={formatOptionLabel}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-2/5">
                        <BinaryFileUpload
                            name="list"
                            onChange={onFileChange}
                            fileAsObject={false}
                        // acceptTypes={['.xlsx, .csv']}
                        />
                    </div>
                </div>

                <div className="flex">
                    <Button
                        text="Import"
                        submit
                        loading={result.isLoading}
                        disabled={result.isLoading || studentsCount > 50}
                    />
                    {/* {checkEmailResult?.data?.length > 0 ? (
                        <Button text="Import" submit disabled />
                    ) : (
                        <Button
                            text="Import"
                            submit
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        />
                    )} */}
                </div>
            </form>
        </FormProvider>
    )
}
