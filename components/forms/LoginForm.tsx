import * as Yup from 'yup'
import Link from 'next/link'
import { LoginCredentials } from '@types'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Checkbox, LoadingAnimation, TextInput } from '@components'

export const LoginForm = ({
    onSubmit,
    result,
}: {
    onSubmit: SubmitHandler<LoginCredentials>
    result: any
}) => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid Email')
            .required('Email is required!'),
        password: Yup.string().required('Password is required'),
    })

    const methods = useForm<LoginCredentials>({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    return result.isLoading || result.isSuccess ? (
        <div className="min-h-[268px] flex flex-col items-center justify-center">
            <LoadingAnimation />
            <div className="text-center">
                <p className="font-semibold text-blue-500">Logging You In...</p>
                <p className="text-sm text-gray-500">Please wait...</p>
            </div>
        </div>
    ) : (
        <FormProvider {...methods}>
            <form
                className="mt-2 w-full"
                // onSubmit={(e: any) => {
                //     methods.handleSubmit((values) => {
                //         onSubmit(values, e)
                //     })(e)
                // }}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <div className="">
                    <TextInput
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Your Email Here...'}
                        validationIcons
                        required
                    />

                    <TextInput
                        label={'Password'}
                        name={'password'}
                        type={'password'}
                        placeholder={'Your Password Here...'}
                        validationIcons
                        required
                    />

                    <Checkbox name={'remember'} label={'Keep me logged in'} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <Button
                        submit
                        // disabled={!(isValid && dirty)}
                        loading={result.isLoading}
                        disabled={result.isLoading}
                    >
                        Login
                    </Button>

                    <Link href="/auth/forgot-password" className={
                        'text-sm font-semibold underline text-muted hover:text-link transition-all duration-300'
                    }>
                        
                            Forgot Password?
                        
                    </Link>
                </div>
            </form>
        </FormProvider>
    );
}
