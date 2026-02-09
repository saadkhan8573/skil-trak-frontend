import { TextInput, ShowErrorNotifications } from '@components'
import { Modal } from '@components/Modal'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// queries
import { SubAdminApi } from '@queries'
import { useNotification } from '@hooks'

export const EditPassword = ({
    onCancel,
    student,
}: {
    student: any
    onCancel: () => void
}) => {
    const { notification } = useNotification()
    const [password, setPassword] = useState({
        password: '',
        confirmPassword: '',
    })
    const [changePassword, changePasswordResult] =
        SubAdminApi.Student.useChangePassword()

    useEffect(() => {
        if (changePasswordResult.isSuccess) {
            notification.success({
                title: 'Password Updated',
                description: 'Password Updated Successfully',
            })
            onCancel()
        }
    }, [changePasswordResult])

    const onChangePassword = (e: any) => {
        const { name, value } = e.target
        setPassword((password) => ({
            ...password,
            [name]: value,
        }))
    }

    const validationSchema = Yup.object({
        password: Yup.string().required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Must confirm entered password'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    })

    const onSubmit = () => {
        changePassword({ ...password, email: student?.user?.email })
    }
    return (
        <div>
            <ShowErrorNotifications result={changePasswordResult} />
            <Modal
                title={'Edit Password'}
                subtitle={'Edit Password'}
                onConfirmClick={onSubmit}
                onCancelClick={onCancel}
                loading={changePasswordResult.isLoading}
                disabled={
                    !password.password ||
                    !password.confirmPassword ||
                    password.password !== password.confirmPassword
                }
            >
                <FormProvider {...methods}>
                    <form
                        className="mt-2 w-full"
                        onSubmit={methods.handleSubmit(onSubmit)}
                    >
                        <TextInput
                            label={'Password'}
                            name={'password'}
                            type={'password'}
                            placeholder={'Password'}
                            onChange={onChangePassword}
                            value={password.password}
                        />
                        <TextInput
                            label={'Confirm Password'}
                            name={'confirmPassword'}
                            type={'password'}
                            placeholder={'Confirm Password'}
                            onChange={onChangePassword}
                            value={password.confirmPassword}
                        />
                    </form>
                </FormProvider>
            </Modal>
        </div>
    )
}
