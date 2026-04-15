import { LoadingAnimation, Modal, NoData, Typography } from '@components'
import { CommonApi } from '@queries'
import React, { useEffect, useState } from 'react'

export const ViewUserPassword = ({
    name,
    onCancel,
    user,
}: {
    name: string
    onCancel: () => void
    user: number
}) => {
    const [copiedPassword, setCopiedPassword] = useState<string | null>(null)

    const getUserPassword = CommonApi.ViewPassword.getUserPassword(user, {
        skip: !user,
        refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
        if (copiedPassword) {
            // ✅ Store timeout to ensure cleanup
            const timeoutId = setTimeout(() => {
                setCopiedPassword(null)
            }, 3000)

            // ✅ Cleanup on unmount or password change
            return () => clearTimeout(timeoutId)
        }
    }, [copiedPassword])

    return (
        <div>
            <Modal
                title={`${name} Account Password`}
                subtitle={'Here is password'}
                onConfirmClick={() => {
                    navigator.clipboard.writeText(
                        getUserPassword?.data?.password
                    )
                    setCopiedPassword(getUserPassword?.data?.password)
                }}
                onCancelClick={onCancel}
                confirmText={copiedPassword ? 'Copied' : 'Copy'}
                disabled={!getUserPassword.isSuccess}
            >
                {getUserPassword.isError && (
                    <NoData
                        text={
                            'Some technical Issue, Close Modal and Try again.'
                        }
                        isError
                    />
                )}
                {getUserPassword.isLoading ? (
                    <LoadingAnimation size={60} />
                ) : getUserPassword.data?.password ? (
                    <Typography>{getUserPassword?.data?.password}</Typography>
                ) : (
                    !getUserPassword.isError && (
                        <NoData
                            text={
                                'There is no password for this User, Create a new password from update password in edit profile'
                            }
                        />
                    )
                )}
            </Modal>
        </div>
    )
}
