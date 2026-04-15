import {
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { PermissionFormType, PermissionType } from '@types'
import { AdminApi } from '@queries'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { UserRoles } from '@constants'

const validationSchema = yup.object().shape({
    code: yup.string().required('Permission code is required'),
    name: yup.string().required('Permission name is required'),
    description: yup.string().optional(),
    roles: yup
        .array()
        .of(yup.string())
        .min(1, 'At least one role is required')
        .required('User roles are required'),
})

export const PermissionForm = ({
    onSubmit,
    result,
    initialValues,
    edit,
}: {
    edit?: boolean
    onSubmit: (values: PermissionFormType) => void
    result: any
    initialValues?: any
}) => {
    const { data: allPermissions } = AdminApi.Permissions.useListQuery(
        {
            limit: 1000,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const formMethods = useForm<PermissionFormType>({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
    })

    useEffect(() => {
        if (result.isSuccess) {
            formMethods.reset()
        }
    }, [result])

    useEffect(() => {
        if (initialValues) {
            formMethods.reset(initialValues)
        }
    }, [initialValues])

    const code = formMethods.watch('code')

    useEffect(() => {
        if (code) {
            const label = code
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            formMethods.setValue('name', label, { shouldValidate: true })
        }
    }, [code])

    const permissionTypeOptions = useMemo(() => {
        const existingCodes =
            allPermissions?.data?.map((p: any) => p.code) || []

        return Object.values(PermissionType)
            .filter((type) => {
                // Keep the current code if we're in edit mode
                if (edit && initialValues?.code === type) return true
                // Otherwise, exclude if it's already in the system
                return !existingCodes.includes(type)
            })
            .map((type) => ({
                label: type
                    .toLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                value: type,
            }))
    }, [allPermissions, edit, initialValues])

    const rolesOptions = useMemo(() => {
        const baseRoles = [
            { label: 'Sub Admin', value: UserRoles.SUBADMIN },
            { label: 'RTO', value: UserRoles.RTO },
        ]

        if (edit && initialValues?.roles) {
            return baseRoles.map((role: any) => ({
                ...role,
                isFixed: initialValues.roles.includes(role.value),
            }))
        }

        return baseRoles
    }, [edit, initialValues])

    return (
        <>
            <ShowErrorNotifications result={result} />
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <Select
                        label={'Permission Code'}
                        name={'code'}
                        options={permissionTypeOptions}
                        placeholder={'Select Permission Code...'}
                        validationIcons
                        required
                        onlyValue
                        maxMenuHeight={225}
                    />

                    <Select
                        label={'User Roles'}
                        name={'roles'}
                        options={rolesOptions}
                        placeholder={'Select User Roles...'}
                        validationIcons
                        required
                        multi
                        // disabled={edit}
                        onlyValue
                    />

                    <TextArea
                        label={'Description (optional)'}
                        name={'description'}
                        rows={5}
                        placeholder={'Enter Description...'}
                    />

                    <div className="flex justify-end">
                        <Button
                            submit
                            text={edit ? 'Update Permission' : 'Add Permission'}
                            variant={edit ? 'secondary' : 'primary'}
                            loading={result?.isLoading}
                            disabled={result?.isLoading}
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}
