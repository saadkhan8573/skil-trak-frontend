import {
    Button,
    GlobalModal,
    TextInput,
    Typography
} from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { LiaTimesSolid } from 'react-icons/lia'
import * as Yup from 'yup'

export const AuthenticateUserModal = ({
    onCancel,
}: {
    onCancel: () => void
}) => {
    const router = useRouter()
    const password = process.env.NEXT_PUBLIC_UPDATE_DATE

    const validationSchema = Yup.object({
        password: Yup.string().required('Password is required!'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onEnterPassword = (values: any) => {
        if (values?.password === password) {
            onCancel()
        } else {
            methods.setError('password', {
                type: 'manual',
                message: 'Password does not match!',
            })
        }
    }

    return (
        <GlobalModal>
            <div className="rounded-lg overflow-hidden max-w-2xl min-w-[600px]">
                <div className="grid grid-cols-3 py-3 px-4 border-b border-[#E6E6E6]">
                    <div className="col-start-2">
                        <Typography center semibold>
                            Authenticate
                        </Typography>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => router.back()}
                            Icon={LiaTimesSolid}
                            variant='primaryNew'
                            mini
                            outline
                        />
                    </div>
                </div>

                {/*  */}
                <div className="p-5">
                    <FormProvider {...methods}>
                        <form
                            className="mt-2 w-full"
                            onSubmit={methods.handleSubmit(onEnterPassword)}
                        >
                            <TextInput
                                name={'password'}
                                label={'Enter Password'}
                                placeholder={'Enter Password'}
                                validationIcons
                                required
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button
                                    text="Cancel"
                                    variant="secondary"
                                    onClick={() => router.back()}
                                />
                                <Button text="Submit" submit />
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </GlobalModal>
    )
}
