import { Button, Select, TextInput, Typography } from '@components'
import { BinaryFileUpload } from '@components/inputs/BinaryFileUpload'
import { yupResolver } from '@hookform/resolvers/yup'
import { AdminApi } from '@queries'
import { Course } from '@types'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface FormProps {
    onSubmit: any
    edit?: boolean
    initialValues?: any
    onStudentFound: Function
    setEmailExistList: Function
}
export const ImportStudentForm = ({
    onSubmit,
    edit,
    initialValues,
    onStudentFound,
    setEmailExistList,
}: FormProps) => {
    const sectors = AdminApi.Sectors.useListQuery({
        limit: 100,
        skip: 0,
        search: '',
    })
    const [checkEmail, checkEmailResult] = AdminApi.Rtos.useCheckStudentEmail()

    const courses = AdminApi.Courses.useListQuery({
        limit: 100,
        skip: 0,
        search: '',
    })

    const [selectableCourses, setSelectableCourses] = useState<Course[]>([])
    const [emailExists, setEmailExists] = useState<any>([])

    useEffect(() => {
        if (checkEmailResult.isSuccess && checkEmailResult?.data) {
            setEmailExistList(checkEmailResult?.data)
        }
    }, [checkEmailResult])
    const onSectorSelect = (options: any) => {
        const currentSelectedSectors = options.map((opt: any) => opt.value)

        const currentSelectableCourses: Course[] = []
        currentSelectedSectors.forEach((sectorId: number) => {
            const currentCourses = courses.data?.data.filter(
                (c) => c.sector.id === sectorId
            )

            if (currentCourses?.length)
                currentSelectableCourses.push(...currentCourses)
        })

        setSelectableCourses(currentSelectableCourses)
    }

    const validationSchema = yup.object({})

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: 'all',
    })

    const onFileChange = async (e: any, fileData: any) => {
        const { read, utils } = await import('xlsx')
        const wb = read(e.target.result, { type: 'binary' })
        const sheets = wb.SheetNames

        if (sheets.length) {
            const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
            const result: any = await checkEmail({
                body: rows.map((row: any) => row.email),
            })
            if (result?.data && result?.data?.email) {
                setEmailExists([...emailExists, result?.data?.email])
            }
            onStudentFound && onStudentFound(rows, fileData, emailExists)
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className={'flex flex-col gap-y-2'}>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput label={'Batch/Class'} name="batch" />
                        <TextInput
                            label={'Expiry Date'}
                            name="expiry"
                            type="date"
                        />
                    </div>

                    <div className="mb-4">
                        <Typography variant={'muted'} color={'text-gray-400'}>
                            Sectors &amp; Courses
                        </Typography>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
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
                            />

                            <Select
                                name={'courses'}
                                label={'Courses'}
                                options={selectableCourses.map((c) => ({
                                    label: c.title,
                                    value: c.id,
                                }))}
                                multi
                            />
                        </div>
                    </div>

                    <BinaryFileUpload
                        name="list"
                        onChange={onFileChange}
                        fileAsObject={false}
                    // acceptTypes={['.xlsx, .csv']}
                    />

                    <div className="flex">
                        {checkEmailResult?.data?.length > 0 ? (
                            <Button text="Import" submit disabled />
                        ) : (
                            <Button text="Import" submit />
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
