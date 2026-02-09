import {
    Modal,
    RadioGroup,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
    Typography,
    useAuthorizedUserComponent,
} from '@components'
import { UserRoles } from '@constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification, useSubadminProfile } from '@hooks'
import { SubAdminApi } from '@queries'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

export enum flagStudentPriorityEnum {
    Critical = 'critical',
    Medium = 'medium',
    High = 'high',
}
export enum flagStudentCategoryEnum {
    Scheduling = 'scheduling',
    Communication = 'communication',
    Documentation = 'documentation',
    Logistics = 'logistics',
    Compliance = 'compliance',
    Capacity = 'capacity',
}
export const FlagStudentModal = ({
    onCancel,
    studentId,
    workplaceId,
}: {
    studentId: number
    workplaceId?: number
    onCancel: () => void
}) => {
    const [problematicStudent, problematicStudentResult] =
        SubAdminApi.Student.useProblamaticStudent()

    const { notification } = useNotification()

    const subadmin = useSubadminProfile()

    const hasPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN],
        isHod: subadmin?.departmentMember?.isHod,
    })

    const validationSchema = Yup.object({
        comment: Yup.string().required('Please provide the note'),

        isReported: Yup.string()
            .nullable()
            .required('Please select the option Yes/No'),

        title: Yup.string().when('isReported', {
            is: (val: string) => val === 'yes',
            then: (schema) => schema.required('Please provide a title'),
            otherwise: (schema) => schema.notRequired(),
        }),

        priority: Yup.string().when('isReported', {
            is: (val: string) => val === 'yes',
            then: (schema) => schema.required('Please select a priority'),
            otherwise: (schema) => schema.notRequired(),
        }),

        category: Yup.string().when('isReported', {
            is: (val: string) => val === 'yes',
            then: (schema) => schema.required('Please select a category'),
            otherwise: (schema) => schema.notRequired(),
        }),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema) as any,
        mode: 'all',
    })
    const { watch } = methods
    const isReported = watch('isReported')

    const onSubmit = (values: any) => {
        const isReported = values?.isReported === 'yes' ? true : false
        const body = {
            ...values,
            isReported,
        }
        if (workplaceId) {
            body.workplaceId = workplaceId
        }
        problematicStudent({ studentId, body }).then((res: any) => {
            if (res?.data) {
                notification?.[hasPermission ? 'success' : 'warning']({
                    title: `Mark As Flaged ${!hasPermission ? 'request sent' : ''
                        }`,
                    description: `Marked As Flaged ${!hasPermission ? 'request sent to manager' : ''
                        } successfully!`,
                })
                onCancel()
            }
        })
    }
    const priorityOptions = [
        { label: 'Critical', value: flagStudentPriorityEnum.Critical },
        { label: 'High', value: flagStudentPriorityEnum.High },
        { label: 'Medium', value: flagStudentPriorityEnum.Medium },
    ]
    const categoryOptions = [
        { label: 'Scheduling', value: flagStudentCategoryEnum.Scheduling },
        {
            label: 'Communication',
            value: flagStudentCategoryEnum.Communication,
        },
        {
            label: 'Documentation',
            value: flagStudentCategoryEnum.Documentation,
        },
        { label: 'Logistics', value: flagStudentCategoryEnum.Logistics },
        { label: 'Compliance', value: flagStudentCategoryEnum.Compliance },
        { label: 'Capacity', value: flagStudentCategoryEnum.Capacity },
    ]
    return (
        <>
            <ShowErrorNotifications result={problematicStudentResult} />
            <Modal
                title="Flagged Student"
                onCancelClick={onCancel}
                subtitle="Flagged Student"
                loading={problematicStudentResult.isLoading}
                onConfirmClick={methods.handleSubmit(onSubmit)}
            >
                <FormProvider {...methods}>
                    <form className="w-full">
                        <TextArea
                            label={'Provide Note Please'}
                            required
                            name={'comment'}
                            placeholder={'reason...'}
                            rows={5}
                        />
                        <Typography variant="small" italic semibold>
                            Do you want to report this to the Training
                            Organization?
                        </Typography>
                        <div className="flex items-center gap-x-4 mt-4">
                            <RadioGroup
                                // label={'aaaa'}
                                name="isReported"
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                ]}
                                required
                            />
                        </div>
                        {isReported === 'yes' && (
                            <>
                                <TextInput
                                    name="title"
                                    placeholder="Issue title"
                                />
                                <div className="flex items-center gap-x-2 w-160">
                                    <div className="w-1/2">
                                        <Select
                                            label={'Priority'}
                                            name={'priority'}
                                            placeholder={'Priority...'}
                                            // defaultValue={priorityOptions?.[0]}
                                            options={priorityOptions}
                                            onlyValue
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <Select
                                            label={'Category'}
                                            name={'category'}
                                            placeholder={'Category...'}
                                            // defaultValue={priorityOptions?.[0]}
                                            options={categoryOptions}
                                            onlyValue
                                        />
                                    </div>
                                </div>
                            </>
                        )}{' '}
                    </form>
                </FormProvider>
            </Modal>
        </>
    )
}
