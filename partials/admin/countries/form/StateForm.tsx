import {
    Button,
    Select,
    TextInput,
    Typography
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { CommonApi } from '@queries'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface StateFormProps {
    result: any
    onSubmit: (values: any) => void
    edit?: boolean
    initialValues?: any
    requirementFile?: any
    setRequirementFile?: Function
}

export const StateForm = ({
    edit,
    onSubmit,
    result,
    initialValues,
    requirementFile,
    setRequirementFile,
}: StateFormProps) => {
    const { data, isLoading } = CommonApi.Countries.useCountriesList()

    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        // code: yup.string().required('Code is Required'),
        // hours: yup.number().required('Hours are required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: 'all',
    })

    return (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className="">
                    <div className="mb-4">
                        <div className="mb-2">
                            <Typography
                                variant={'muted'}
                                color={'text-gray-400'}
                            >
                                Country Selection
                            </Typography>
                        </div>

                        {edit ? (
                            <>
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-400'}
                                >
                                    Country
                                </Typography>
                                <Typography
                                    variant={'label'}
                                    color={'text-gray-600'}
                                >
                                    {initialValues?.country?.name}
                                </Typography>
                            </>
                        ) : (
                            <div>
                                <Select
                                    name="country"
                                    label={'State Country'}
                                    options={data?.map((country: any) => ({
                                        label: country.name,
                                        value: country.id,
                                    }))}
                                    loading={isLoading}
                                />
                            </div>
                        )}
                    </div>

                    <TextInput
                        label={'Name'}
                        name={'name'}
                        placeholder={'State Name...'}
                        required
                        validationIcons
                    />
                    {/* <div className="mb-2">
                        <Typography variant={'muted'} color={'text-gray-400'}>
                            Course Info
                        </Typography>
                    </div> */}

                    {/* <div className="grid grid-cols-2 gap-x-8">
                        <TextInput
                            label={'Code'}
                            name={'code'}
                            placeholder={'Course Code...'}
                            required
                            validationIcons
                        />

                        <TextInput
                            label={'Title'}
                            name={'title'}
                            placeholder={'Course Title...'}
                            required
                            validationIcons
                        />

                        <TextInput
                            label={'Hours'}
                            name={'hours'}
                            placeholder={'Course Hours...'}
                            required
                            validationIcons
                        />
                    </div> */}

                    {/* <div>
                        <ContentEditor
                            label="Requirement"
                            content={requirementFile}
                            setContent={setRequirementFile}
                        />
                    </div> */}

                    {/* <div className="grid grid-cols-1 gap-x-8">
                        <TextArea
                            label={'Description'}
                            name={'description'}
                            placeholder={'Course Description...'}
                            required
                            validationIcons
                        />
                    </div> */}

                    <div>
                        <Button
                            submit
                            // disabled={!(isValid && dirty)}
                            disabled={result.isLoading}
                            loading={result.isLoading}
                        >
                            {edit ? 'Update State' : 'Add State'}
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
