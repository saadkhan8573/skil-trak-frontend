import { Modal, Select, ShowErrorNotifications, TextInput } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { AdminApi } from '@queries'
import { Course, OptionType, Sector } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useDepartmentDetailContext } from '../hooks'

export const AddDepartmentEmailModal = ({
    onCancel,
    departmentId,
    deptName,
    deptEmail,
    canViewCourseRequests,
}: {
    deptName: string
    deptEmail: string
    departmentId: number
    onCancel: () => void
    canViewCourseRequests?: any
}) => {
    const { deptCourses } = useDepartmentDetailContext()

    const { notification } = useNotification()

    const router = useRouter()

    const [selectedSectors, setSelectedSectors] = useState<number[]>([])

    const sectors = AdminApi.Sectors.useListQuery({
        limit: 100,
        skip: 0,
        search: '',
    })
    const sectotsadded = AdminApi.Department.getSectorsAddingList(
        Number(router?.query?.id),
        {
            skip: !router?.query?.id,
        }
    )
    const accessOptions = [
        {
            label: 'Partial',
            value: 'partial',
        },
        {
            label: 'Full',
            value: 'full',
        },
        {
            label: 'None',
            value: null,
        },
    ]
    const findOptionByValue = (options: any[], value: any) => {
        if (Array.isArray(value)) {
            return (
                options?.filter((option) => value.includes(option?.value)) || []
            )
        }
        return options?.find((option) => option?.value === value) || null
    }

    const uniqueSectors2 = useMemo(
        () =>
            Array.from(
                new Set(
                    deptCourses?.data?.map(
                        (course: Course) => course?.sector?.id
                    )
                )
            )
                .map(
                    (id) =>
                        deptCourses?.data?.find(
                            (course: Course) => course?.sector?.id === id
                        )?.sector
                )
                ?.map((s: Sector) => ({
                    label: s?.name,
                    value: s?.id,
                }))
                ?.map((a: OptionType) => a?.value),
        [deptCourses]
    )

    useEffect(() => {
        setSelectedSectors(uniqueSectors2 as number[])
    }, [uniqueSectors2])

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid Email')
            .required('Email is required!'),
        name: Yup.string().required('Name is required'),
    })

    const methods = useForm<any>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            name: deptName,
            email: deptEmail,
            sectors: uniqueSectors2,
        },
    })

    const [updateDepartment, updateDepartmentResult] =
        AdminApi.Department.updateDepartment()

    const onConfirm = async (values: any) => {
        const res: any = await updateDepartment({
            ...values,
            departmentId,
        })

        if (res?.data) {
            notification.success({
                title: 'Department Updated',
                description: 'Department Updated Successfully',
            })
            onCancel()
        }
    }

    const sectorsOptions = sectotsadded?.data?.map((s: Sector) => ({
        label: s.name,
        value: s.id,
    }))

    return (
        <>
            <ShowErrorNotifications result={updateDepartmentResult} />
            <Modal
                title="Update Department"
                subtitle=" "
                onCancelClick={onCancel}
                onConfirmClick={methods.handleSubmit(onConfirm)}
                loading={updateDepartmentResult?.isLoading}
            >
                <div className="max-w-5xl max-h-[72vh] overflow-auto custom-scrollbar">
                    <FormProvider {...methods}>
                        <form className="mt-2 w-full">
                            <div className="">
                                <TextInput
                                    label={'Name'}
                                    name={'name'}
                                    placeholder={'Your Name Here...'}
                                    validationIcons
                                    required
                                />
                                <TextInput
                                    label={'Email'}
                                    name={'email'}
                                    type={'email'}
                                    placeholder={'Your Email Here...'}
                                    validationIcons
                                    required
                                />
                                <Select
                                    name={'sectors'}
                                    label={'Sector'}
                                    options={
                                        sectors.isLoading ? [] : sectorsOptions
                                    }
                                    onChange={(options: number[]) => {
                                        setSelectedSectors(options)
                                    }}
                                    menuPlacement="top"
                                    onlyValue
                                    loading={
                                        sectors.isLoading ||
                                        deptCourses?.isLoading
                                    }
                                    disabled={
                                        sectors.isLoading ||
                                        deptCourses?.isLoading
                                    }
                                    multi
                                />
                                <Select
                                    options={accessOptions}
                                    label="Access Permission"
                                    name="canViewCourseRequests"
                                    onlyValue
                                    defaultValue={findOptionByValue(
                                        accessOptions,
                                        canViewCourseRequests
                                    )}
                                    menuPlacement="top"
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </Modal>
        </>
    )
}
