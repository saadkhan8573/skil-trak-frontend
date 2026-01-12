import {
    Button,
    NoData,
    Select,
    ShowErrorNotifications,
    TextInput,
} from '@components'
import { CommonApi, RtoV2Api } from '@queries'
import { CheckCircle2, Plus } from 'lucide-react'
import { EligibleWpTypeCard } from './card'
import { useEffect } from 'react'
import { useNotification } from '@hooks'
import { FormProvider, useForm } from 'react-hook-form'

interface DropdownFormValues {
    wpTypeId: number | null
}

interface CustomInputFormValues {
    customWpTypeName: string
}

export const EligibleWpTypes = ({ courseId }: { courseId: number }) => {
    const { notification } = useNotification()

    // Form for dropdown selection
    const dropdownMethods = useForm<DropdownFormValues>({
        mode: 'all',
        defaultValues: {
            wpTypeId: null,
        },
    })

    // Form for custom input
    const customInputMethods = useForm<CustomInputFormValues>({
        mode: 'all',
        defaultValues: {
            customWpTypeName: '',
        },
    })

    const { data, isLoading, isError } =
        RtoV2Api.Courses.useCourseWorkplaceTypes(courseId, {
            skip: !courseId,
        })

    const wpTypes = CommonApi.Rtos.getRtoWpTypes(courseId)

    const [createRtoWpType, createRtoWpTypeResult] =
        RtoV2Api.Courses.createRtoWpType()

    // Filter out already added workplace types
    const wpTypesOptions = wpTypes?.data
        ?.filter((wpType: any) => {
            // Exclude already added types
            const isAlreadyAdded = data?.some(
                (addedType: any) => addedType?.workplaceType?.id === wpType?.id
            )
            return !isAlreadyAdded
        })
        ?.map((wpType: any) => ({
            value: wpType?.id,
            label: wpType?.name,
        }))

    // Watch form values for cross-form clearing
    const watchedDropdownValue = dropdownMethods.watch('wpTypeId')
    const watchedCustomValue = customInputMethods.watch('customWpTypeName')

    // Clear custom input when dropdown is selected
    useEffect(() => {
        if (watchedDropdownValue) {
            customInputMethods.setValue('customWpTypeName', '')
        }
    }, [watchedDropdownValue])

    // Clear dropdown when custom input has value
    useEffect(() => {
        if (watchedCustomValue) {
            dropdownMethods.setValue('wpTypeId', null)
        }
    }, [watchedCustomValue])

    // Reset forms on successful submission
    useEffect(() => {
        if (createRtoWpTypeResult?.isSuccess) {
            notification.success({
                title: 'Workplace Type Added',
                description: 'Workplace type added successfully',
            })
            dropdownMethods.setValue('wpTypeId', null)
            dropdownMethods.reset({
                wpTypeId: null,
            })
            customInputMethods.setValue('customWpTypeName', '')
            customInputMethods.reset({
                customWpTypeName: '',
            })
        }
    }, [createRtoWpTypeResult?.isSuccess])

    const onSubmitFromDropdown = async (values: DropdownFormValues) => {
        if (!values.wpTypeId) {
            notification.error({
                title: 'Invalid Selection',
                description: 'Please select a workplace type from the dropdown',
            })
            return
        }

        const selectedWpType = wpTypes?.data?.find(
            (wpType: any) => wpType?.id === values.wpTypeId
        )

        await createRtoWpType({
            id: courseId,
            name: selectedWpType?.name,
            workplaceTypeId: selectedWpType?.id,
        })
    }

    const onSubmitCustomInput = async (values: CustomInputFormValues) => {
        if (!values.customWpTypeName?.trim()) {
            notification.error({
                title: 'Invalid Input',
                description: 'Please enter a custom workplace type name',
            })
            return
        }

        await createRtoWpType({
            id: courseId,
            name: values.customWpTypeName.trim(),
        })
    }

    return (
        <div>
            <ShowErrorNotifications result={createRtoWpTypeResult} />
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <h3 className="font-semibold text-base">
                    Eligible Workplace Types
                </h3>
            </div>
            {isError && <NoData isError />}

            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-xl p-5 border border-success/20">
                {/* Display existing workplace types */}
                {data && data?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {data?.map((type: any, index: number) => (
                            <EligibleWpTypeCard
                                key={type?.id}
                                type={type}
                                courseId={courseId}
                            />
                        ))}
                    </div>
                ) : (
                    !isError && <NoData text="No workplace type found" />
                )}

                {/* Add new workplace type section - ALWAYS VISIBLE */}
                <div className="space-y-3 border-t border-success/20 pt-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        Add New Workplace Type
                    </p>

                    {/* Dropdown Selection Form */}
                    <FormProvider {...dropdownMethods}>
                        <form
                            onSubmit={dropdownMethods.handleSubmit(
                                onSubmitFromDropdown
                            )}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Select from existing types
                                </label>
                                <div className="flex items-end gap-2">
                                    <div className="w-full">
                                        <Select
                                            label=""
                                            name="wpTypeId"
                                            options={wpTypesOptions}
                                            loading={wpTypes?.isLoading}
                                            disabled={
                                                wpTypes?.isLoading ||
                                                !!watchedCustomValue
                                            }
                                            onlyValue
                                            showError={false}
                                            placeholder="Choose a workplace type..."
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        Icon={Plus}
                                        text="Add"
                                        outline
                                        submit
                                        loading={
                                            createRtoWpTypeResult?.isLoading
                                        }
                                        disabled={
                                            createRtoWpTypeResult?.isLoading ||
                                            !watchedDropdownValue
                                        }
                                        className="whitespace-nowrap"
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>

                    {/* Divider with OR text */}
                    <div className="relative flex items-center pb-0 mb-0">
                        <div className="flex-grow border-t border-success/20"></div>
                        <span className="flex-shrink mx-4 text-xs text-muted-foreground font-medium">
                            OR
                        </span>
                        <div className="flex-grow border-t border-success/20"></div>
                    </div>

                    {/* Custom Input Form */}
                    <FormProvider {...customInputMethods}>
                        <form
                            onSubmit={customInputMethods.handleSubmit(
                                onSubmitCustomInput
                            )}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Enter custom workplace type
                                </label>
                                <div className="flex items-end gap-2">
                                    <TextInput
                                        name="customWpTypeName"
                                        placeholder="Type a new workplace type name..."
                                        className="flex-1 text-sm bg-background/50"
                                        showError={false}
                                        disabled={!!watchedDropdownValue}
                                    />
                                    <Button
                                        variant="primary"
                                        Icon={Plus}
                                        text="Add"
                                        outline
                                        submit
                                        loading={
                                            createRtoWpTypeResult?.isLoading
                                        }
                                        disabled={
                                            createRtoWpTypeResult?.isLoading ||
                                            !watchedCustomValue?.trim()
                                        }
                                        className="whitespace-nowrap"
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}
