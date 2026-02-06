import {
    Button,
    Checkbox,
    Select,
    SelectOption,
    TextArea,
    TextInput,
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { AddFolderFormType, Folder, TypeOptionsEnum } from '@types'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface CourseFolderFormProps {
    initialValues?: Folder
    onSubmit: (values: AddFolderFormType) => void
    edit?: boolean
    onCancel?: () => void
}

export const CourseFolderForm = ({
    onSubmit,
    edit,
    initialValues,
    onCancel,
}: CourseFolderFormProps) => {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [isIndustryCheck, setIsIndustryCheck] = useState<boolean>(false)

    useEffect(() => {
        if (initialValues) {
            if (initialValues?.type) {
                setSelectedType(initialValues?.type)
            }
            if (initialValues?.isIndustryCheck) {
                setIsIndustryCheck(initialValues?.isIndustryCheck)
            }
        }
    }, [initialValues])

    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        capacity: yup.number().required('Capacity is Required'),
        isAgreement: yup.boolean(),
        isFacilityCheckList: yup.boolean(),
    })

    const methods = useForm<AddFolderFormType>({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues as AddFolderFormType,
        mode: 'all',
    })

    const typeOptions = [
        { label: 'Documents', value: TypeOptionsEnum.Documents },
        { label: 'Images', value: TypeOptionsEnum.Images },
        { label: 'Videos', value: TypeOptionsEnum.Videos },
    ]

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className="">
                    <div className="flex flex-col">
                        <TextInput
                            label={'Name'}
                            name={'name'}
                            placeholder={'Folder Name...'}
                            required
                        />

                        <TextInput
                            label={'Capacity'}
                            name={'capacity'}
                            type={'number'}
                            placeholder={'Folder Capacity...'}
                            required
                        />
                        {isIndustryCheck && (
                            <TextInput
                                label={'Link'}
                                name={'link'}
                                type="url"
                                placeholder={'Folder Link...'}
                                required
                            />
                        )}

                        <Select
                            name="type"
                            label={'Type'}
                            required
                            value={typeOptions?.find(
                                (type: SelectOption) =>
                                    type.value === selectedType
                            )}
                            options={typeOptions}
                            onChange={(e: any) => {
                                setSelectedType(String(e))
                            }}
                            onlyValue
                        />

                        <TextArea
                            label={'Description'}
                            name={'description'}
                            placeholder={'Folder Description...'}
                            required
                            validationIcons
                        />

                        {edit && (
                            <>
                                <Checkbox
                                    label={'Is Agreement'}
                                    name="isAgreement"
                                    onChange={(e: any) => {
                                        if (e.target.checked) {
                                            methods.setValue(
                                                'isFacilityCheckList',
                                                false
                                            )
                                        }
                                    }}
                                />
                                <Checkbox
                                    label={'Is Facility Checklist'}
                                    name="isFacilityCheckList"
                                    onChange={(e: any) => {
                                        if (e.target.checked) {
                                            methods.setValue(
                                                'isAgreement',
                                                false
                                            )
                                        }
                                    }}
                                />
                            </>
                        )}
                        {/* <Checkbox
                            label={'Is IndustryCheck'}
                            name="isIndustryCheck"
                            defaultChecked={isIndustryCheck}
                            onChange={(e: any) =>
                                setIsIndustryCheck(e?.target?.checked)
                            }
                        />
                        <Checkbox name="isRequired" label={'Required'} /> */}
                    </div>

                    <div className="mt-2 flex gap-x-2">
                        <Button
                            variant={edit ? 'info' : 'primary'}
                            submit
                            loading={methods?.formState?.isSubmitting}
                            disabled={methods?.formState?.isSubmitting}
                        >
                            {edit ? 'Update Folder' : 'Add Folder'}
                        </Button>
                        {onCancel && (
                            <Button
                                variant="secondary"
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
