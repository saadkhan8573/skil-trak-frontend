import {
    AuthorizedUserComponent,
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSectorsAndCoursesOptions } from '@hooks'
import { AdminApi, AuthApi } from '@queries'
import {
    Course,
    OptionType,
    Rto,
    Sector,
    SubAdmin,
    SubadminFromType,
} from '@types'
import {
    CourseSelectOption,
    formatOptionLabel,
    getSectorsDetail,
    getUserCredentials,
} from '@utils'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export const SubAdminForm = ({
    onSubmit,
    result,
    subAdmin,
    edit,
    rtoCoursesOptions,
}: {
    edit?: boolean
    onSubmit: (values: SubadminFromType) => void
    result: any
    subAdmin?: SubAdmin
    rtoCoursesOptions?: OptionType[]
}) => {
    const [selectedRtos, setSelectedRtos] = useState<number[] | null>(null)
    const [rtoSelectedCourses, setRtoSelectedCourses] = useState<
        number[] | null
    >(null)

    const role = getUserCredentials()?.role

    const validationObject = {
        name: yup.string().required('Must provide your name'),
        coordinatorId: yup.string().required('Must provide your name'),
        phone: yup.string().required('Must provide your name'),
        email: yup
            .string()
            .email('Invalid Email')
            .required('Must provide email'),

        // Address Information
        addressLine1: yup.string().required('Must provide address'),
        courses: yup.array().min(1, 'Must select at least 1 course').required(),
    }

    const validation = {
        ...validationObject,
        rtos: yup.array().min(1, 'Must select at least 1 RTO').required(),
        sectors: yup.array().min(1, 'Must select at least 1 sector').required(),
    }

    const rtoValidation = {
        ...validationObject,
    }

    const validationSchema = yup.object(
        role === UserRoles.ADMIN ? validation : rtoValidation
    )
    const getRtos = AuthApi.useRtos({})
    const rtoList = AdminApi.SubAdmins.useRtos(Number(subAdmin?.id))

    const formMethods = useForm<SubadminFromType>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
    })

    useEffect(() => {
        if (result.isSuccess) {
            formMethods.reset()
        }
    }, [result])

    const rtosOptions =
        getRtos?.isSuccess && getRtos?.data && getRtos?.data.length > 0
            ? getRtos?.data.map((rto: any) => ({
                  label: rto?.user?.name,
                  value: rto?.id,
              }))
            : []

    const {
        courseLoading,
        courseOptions,
        courseValues,
        onCourseChange,
        onSectorChanged,
        sectorOptions,
        selectedSector,
        setSelectedSector,
        sectorLoading,
        setSelectedCourses,
    } = useSectorsAndCoursesOptions()

    const rtos = useMemo(
        () => rtoList?.data?.map((rto: Rto) => rto?.id),
        [rtoList]
    )

    useEffect(() => {
        if (subAdmin) {
            const courses = subAdmin?.courses?.map(
                (course: Course) => course?.id
            )
            const sectors: any = getSectorsDetail(subAdmin?.courses as Course[])
            const sSectors: any = sectorOptions?.filter((sector: OptionType) =>
                sectors
                    ?.map((s: Sector) => s?.id)
                    ?.includes(sector?.value as number)
            )
            const values = {
                name: subAdmin?.user?.name,
                email: subAdmin?.user?.email,
                phone: subAdmin?.phone,
                addressLine1: subAdmin?.addressLine1,
                coordinatorId: subAdmin?.coordinatorId,
                rtos,
                courses,
                sectors: sSectors,
            }
            Object.entries(values)?.forEach(([key, value]) => {
                formMethods.setValue(
                    key as keyof SubadminFromType,
                    value as string
                )
            })

            if (edit && role === UserRoles.RTO) {
                setRtoSelectedCourses(courses)
            }

            if (rtos && rtos?.length > 0) {
                setSelectedRtos(rtos)
            }

            if (sSectors && sSectors?.length > 0) {
                setSelectedSector(sSectors)
                onSectorChanged(sSectors)
            }

            if (courses && courses?.length > 0) {
                setSelectedCourses(courses)
            }
        }
    }, [subAdmin, sectorOptions, rtos])

    return (
        <>
            <ShowErrorNotifications result={result} />
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <TextInput
                        label={'Full Name'}
                        name={'name'}
                        placeholder={'Your Full Name...'}
                        validationIcons
                        required
                    />

                    <TextInput
                        label={'Coordinator Id'}
                        name={'coordinatorId'}
                        placeholder={'Coordinator Id...'}
                        validationIcons
                        required
                    />

                    <TextInput
                        label={'Phone No'}
                        name={'phone'}
                        placeholder={'Phone No...'}
                        validationIcons
                        required
                    />

                    <TextInput
                        label={'Email'}
                        type={'email'}
                        name={'email'}
                        placeholder={'Email...'}
                        validationIcons
                        required
                    />

                    <AuthorizedUserComponent
                        roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                    >
                        <Select
                            label={'RTOs'}
                            name={'rtos'}
                            options={rtosOptions}
                            value={rtosOptions?.filter((rto: OptionType) =>
                                selectedRtos?.includes(rto?.value as number)
                            )}
                            onChange={(e: number[]) => {
                                setSelectedRtos(e)
                            }}
                            multi
                            validationIcons
                            onlyValue
                        />
                        <Select
                            label={'Sector'}
                            value={selectedSector}
                            name={'sectors'}
                            options={sectorOptions}
                            placeholder={'Select Sectors...'}
                            multi
                            loading={sectorLoading}
                            disabled={sectorLoading}
                            onChange={onSectorChanged}
                            validationIcons
                        />
                        <Select
                            label={'Courses'}
                            name={'courses'}
                            value={courseValues}
                            defaultValue={courseOptions}
                            options={courseOptions}
                            onChange={(e: number[]) => {
                                onCourseChange(e)
                            }}
                            multi
                            loading={courseLoading}
                            disabled={courseOptions.length === 0}
                            validationIcons
                            onlyValue
                        />
                    </AuthorizedUserComponent>

                    <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                        <Select
                            label={'Courses'}
                            name={'courses'}
                            value={rtoCoursesOptions?.filter(
                                (course: OptionType) =>
                                    rtoSelectedCourses?.includes(
                                        Number(course?.value)
                                    )
                            )}
                            options={rtoCoursesOptions}
                            multi
                            loading={courseLoading}
                            components={{
                                Option: CourseSelectOption,
                            }}
                            onChange={(e: number[]) => {
                                setRtoSelectedCourses(e)
                            }}
                            formatOptionLabel={formatOptionLabel}
                            disabled={
                                rtoCoursesOptions &&
                                rtoCoursesOptions?.length === 0
                            }
                            validationIcons
                            onlyValue
                        />
                    </AuthorizedUserComponent>

                    <TextArea
                        label={'Address'}
                        name={'addressLine1'}
                        placeholder={'Address...'}
                    />
                    <Button
                        submit
                        text={edit ? 'Update' : 'Create'}
                        variant={edit ? 'secondary' : 'primary'}
                        loading={result?.isLoading}
                        disabled={result?.isLoading}
                    />
                </form>
            </FormProvider>
        </>
    )
}
