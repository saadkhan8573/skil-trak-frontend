import {
    AuthorizedUserComponent,
    Button,
    Card,
    Checkbox,
    InitialAvatar,
    InputRichTextEditor,
    Select,
    TextInput,
    inputRichTextEditorErrorMessage,
    useIsRestricted
} from '@components'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { AuthApi } from '@queries'
import { Course, OptionType } from '@types'
import { CourseSelectOption, formatOptionLabel } from '@utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { TicketCreator } from '../enum'

export enum ticketPriorityEnum {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export const AddTicketForm = ({
    result,
    onSubmit,
    students,
    subadmins,
}: {
    result: any
    onSubmit: (values: any) => void
    students: any
    subadmins: any
}) => {
    const sectorResponse = AuthApi.useSectors({})
    const canAccess = useIsRestricted('canCreateInternalTicket', false)

    const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [isInternal, setIsInternal] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        if (router?.query?.student) {
            setSelectedStudent(Number(router?.query?.student))
        }
    }, [router])

    const courses = useMemo(
        () =>
            sectorResponse?.data
                ?.map((sector: any) => {
                    return sector?.courses?.map((course: any) => {
                        return course
                    })
                })
                .flat(),
        [sectorResponse?.data]
    )

    const validationSchema = yup.object({
        assignedTo: yup.number().required('Must provide Assign To'),
        subject: yup.string().required('Must provide Subject'),
        message: yup
            .mixed()
            .test('Message', 'Must Provide Message', (value) =>
                inputRichTextEditorErrorMessage(value)
            ),
        priority: yup.string().required('Must provide Priority'),
    })

    const formMethods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        // defaultValues: {
        //     priority: ticketPriorityEnum.High, // Set default value here
        // },
    })

    // const priorityOptions = [
    //     ...Object.entries(ticketPriorityEnum).map(([label, value]) => ({
    //         label,
    //         value,
    //     })),
    // ]
    const priorityOptions = [
        { label: 'High', value: ticketPriorityEnum.High },
        { label: 'Medium', value: ticketPriorityEnum.Medium },
        { label: 'Low', value: ticketPriorityEnum.Low },
    ]

    // const studentsOptions = students?.data?.length
    //     ? students?.data?.map((student: any) => ({
    //           label: student?.user?.name,
    //           value: student?.id,
    //       }))
    //     : []
    const studentsOptions = useMemo(
        () =>
            students?.data?.length
                ? students?.data?.map((student: any) => ({
                    label:
                        student?.user?.name +
                        student?.studentId +
                        student?.familyName,
                    value: student?.id,
                    item: student,
                }))
                : [],
        [students?.data]
    )

    useEffect(() => {
        if (selectedStudent) {
            const stdCourse = studentsOptions?.find(
                (s: OptionType) => s?.value === selectedStudent
            )?.item?.courses?.[0]?.id
            setSelectedCourse(stdCourse)
            formMethods.setValue('student', selectedStudent)
            formMethods.setValue('course', stdCourse)
        }
    }, [selectedStudent, studentsOptions])

    const subAdminOptions = subadmins?.data?.map((subAdmin: any) => ({
        label: subAdmin?.user?.name,
        value: subAdmin?.user?.id,
    }))

    const courseIds = studentsOptions
        ?.find((s: OptionType) => s?.value === selectedStudent)
        ?.item?.courses?.map(({ id }: { id: number }) => id)

    const coursesData = selectedStudent
        ? courses?.filter((s: Course) => courseIds?.includes(s?.id))
        : courses

    const courseOptions = coursesData?.map((opt: Course) => ({
        item: opt,
        label: opt?.title,
        value: opt?.id,
    }))

    // const uniqueIds: OptionType[] = Object.entries(TicketCreator).map(
    //     ([label, value]: string[]) => ({
    //         label: label?.split('_').join(' '),
    //         value,
    //         item: value,
    //     })
    // )

    const uniqueIds: OptionType[] = [
        {
            label: 'YASEEN KHAN',
            value: TicketCreator.YASEEN_KHAN,
        },
        {
            label: 'JULIE CLARKE',
            value: TicketCreator.JULIE_CLARKE,
        },
        {
            label: 'QANDEEL TANOLI',
            value: TicketCreator.QANDEEL_TANOLI,
        },
    ]

    return (
        <div>
            <Card>
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center">
                            <Select
                                label={'Assign TO'}
                                name={'assignedTo'}
                                placeholder={'Assign TO...'}
                                options={subAdminOptions}
                                loading={subadmins?.isLoading}
                                disabled={subadmins?.isLoading}
                                onlyValue
                            />
                            {/* <Select
                                label={'Link Student (Optional)'}
                                name={'student'}
                                placeholder={'Link Student (Optional)'}
                                options={studentsOptions}
                                onlyValue
                                loading={students.isLoading}
                                disabled={students?.isLoading}
                            /> */}
                            <Select
                                label={'Link Student (Optional)'}
                                name={'student'}
                                placeholder={'Link Student (Optional)'}
                                options={studentsOptions}
                                value={selectedStudent}
                                onChange={(e: any) => {
                                    setSelectedStudent(e)
                                }}
                                onlyValue
                                loading={students.isLoading}
                                disabled={students?.isLoading}
                                components={{
                                    Option: (optionItem: any) => (
                                        <div
                                            ref={optionItem.innerRef}
                                            {...optionItem.innerProps}
                                            className="cursor-pointer flex items-center justify-between text-sm px-2 py-1 hover:bg-gray-100 border-b border-secondary-dark"
                                        >
                                            <div className="px-2 flex items-center gap-x-2">
                                                {optionItem.data?.item?.user
                                                    ?.name && (
                                                        <InitialAvatar
                                                            name={
                                                                optionItem.data
                                                                    ?.item?.user
                                                                    ?.name
                                                            }
                                                            imageUrl={
                                                                optionItem.data
                                                                    ?.item?.user
                                                                    ?.avatar
                                                            }
                                                        />
                                                    )}
                                                <div>
                                                    <p className="text-[11px] text-gray-600">
                                                        {' '}
                                                        {
                                                            optionItem.data
                                                                ?.item
                                                                ?.studentId
                                                        }{' '}
                                                    </p>
                                                    <p>
                                                        {
                                                            optionItem.data
                                                                ?.item?.user
                                                                ?.name
                                                        }{' '}
                                                        {
                                                            optionItem.data
                                                                ?.item
                                                                ?.familyName
                                                        }{' '}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                }}
                                formatOptionLabel={(option: any) => {
                                    return (
                                        <div>
                                            <span>
                                                {option?.item?.studentId}
                                                {' - '}
                                            </span>
                                            <span>
                                                {option?.item?.user?.name}
                                                {' - '}
                                            </span>
                                            <span>
                                                {option?.item?.familyName}
                                            </span>
                                        </div>
                                    )
                                }}
                            />
                            <Select
                                label={'Select Course'}
                                name={'course'}
                                placeholder={'Select Course'}
                                options={courseOptions}
                                onlyValue
                                value={courseOptions?.find(
                                    (c: any) => c?.value === selectedCourse
                                )}
                                onChange={(e: number) => {
                                    setSelectedCourse(e)
                                }}
                                loading={sectorResponse.isLoading}
                                disabled={sectorResponse?.isLoading}
                                components={{
                                    Option: CourseSelectOption,
                                }}
                                formatOptionLabel={formatOptionLabel}
                            />
                            <Select
                                label={'Priority'}
                                name={'priority'}
                                placeholder={'Priority...'}
                                defaultValue={priorityOptions?.[0]}
                                options={priorityOptions}
                                onlyValue
                            />

                            <AuthorizedUserComponent
                                roles={[UserRoles.ADMIN, UserRoles.SUBADMIN]}
                            >
                                {canAccess ? (
                                    <>
                                        {isInternal ? (
                                            <Select
                                                name={'uniqueId'}
                                                placeholder={'Select Unique Id'}
                                                options={uniqueIds}
                                                onlyValue
                                                showError={false}
                                            />
                                        ) : null}
                                        <Checkbox
                                            name={'isInternal'}
                                            label={'Mark Ticket as Internal'}
                                            showError={false}
                                            onChange={(e: any) => {
                                                setIsInternal(
                                                    e?.target?.checked
                                                )
                                            }}
                                        />
                                    </>
                                ) : null}
                            </AuthorizedUserComponent>
                        </div>
                        <TextInput
                            label={'Subject'}
                            name={'subject'}
                            placeholder={'Subject...'}
                            validationIcons
                            required
                        />

                        <InputRichTextEditor
                            name={'message'}
                            label={'Message'}
                        />

                        <Button
                            submit
                            text={'Open Ticket'}
                            variant={'dark'}
                            loading={result.isLoading}
                            disabled={result.isLoading}
                        />
                    </form>
                </FormProvider>
            </Card>
        </div>
    )
}
