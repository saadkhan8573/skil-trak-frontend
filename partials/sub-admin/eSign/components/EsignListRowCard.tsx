import {
    Button,
    Typography,
    WorldwideStudentDataRestriction,
} from '@components'
import React, { ReactElement, useMemo, useState } from 'react'
import { SignerCard } from './SignerCard'
import { UserRoles } from '@constants'
import Link from 'next/link'
import { EsignDocumentStatus, getUserCredentials } from '@utils'
import { CancelInitiateSign } from '@partials/sub-admin/assessmentEvidence/modal'
import { Student } from '@types'
interface Signer {
    user: {
        role: UserRoles
        name?: string
        email?: string
        industry?: { phoneNumber?: string }
        student?: Student
        rto?: { phone?: string }
    }
    status?: string
    updatedAt?: string
}

export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case EsignDocumentStatus.SIGNED:
            return 'text-green-500'
        case EsignDocumentStatus.PENDING:
            return 'text-orange-400'
        case EsignDocumentStatus.CANCELLED:
            return 'text-red-500'
        default:
            return 'text-gray-400'
    }
}
export const EsignListRowCard = ({ document }: any) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const role = getUserCredentials()?.role
    const signer = document?.signers?.find(
        (signer: any) => signer?.user?.role === role
    )

    const onModalCancel = () => setModal(null)
    const onCancelInitiateSignClicked = (eSign: any) => {
        setModal(
            <CancelInitiateSign onCancel={onModalCancel} eSign={document} />
        )
    }

    const filteredSigners = useMemo(() => {
        return document?.signers?.map((signer: Signer) => {
            switch (signer?.user?.role) {
                case UserRoles.RTO:
                case UserRoles.INDUSTRY:
                case UserRoles.SUBADMIN:
                    return (
                        <SignerCard key={signer?.user?.email} signer={signer} />
                    )
                case UserRoles.STUDENT:
                    return (
                        <WorldwideStudentDataRestriction
                            fallbackOptions={{
                                width: '260px',
                                height: '80px',
                            }}
                            anotherUserId={
                                signer?.user?.student?.rto?.user?.id!
                            }
                        >
                            <SignerCard
                                key={signer?.user?.email}
                                signer={signer}
                            />
                        </WorldwideStudentDataRestriction>
                    )
                default:
                    return null
            }
        })
    }, [document])

    return (
        <>
            {modal && modal}
            <div className="flex py-3 flex-col gap-1 bg-[#F4F6F8] rounded-lg">
                <div className="flex pb-5 border-b justify-between items-center">
                    <div className="pl-6">
                        <Typography variant="xs" color="text-gray-400">
                            Document Name
                        </Typography>
                        <Typography
                            variant="body"
                            color="text-primaryNew"
                            semibold
                        >
                            {document?.template?.course?.title || 'NA'}
                            {document?.template?.name || 'NA'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="xs" color="text-gray-400">
                            Course
                        </Typography>
                        <Typography variant="muted" semibold>
                            {document?.template?.course?.title || 'NA'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="xs" color="text-gray-400">
                            Folder
                        </Typography>
                        <Typography variant="muted" semibold>
                            {document?.template?.folder?.name || 'NA'}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="xs" color={'text-gray-400'}>
                            Status
                        </Typography>
                        <Typography
                            variant="muted"
                            color={getStatusColor(document?.status)}
                            semibold
                        >
                            {document?.status || 'NA'}
                        </Typography>
                    </div>
                    <div className="pr-6 flex items-center gap-x-2">
                        {document?.status !== 'cancelled' && (
                            <Button
                                text="Cancel"
                                variant={'error'}
                                outline
                                onClick={onCancelInitiateSignClicked}
                            />
                        )}
                        {signer && signer?.status === 'pending' && (
                            <Link
                                href={`/portals/${
                                    role === UserRoles.SUBADMIN
                                        ? 'sub-admin'
                                        : role
                                }/e-sign/${document?.id}`}
                                className="px-3 py-2 font-medium border hover:bg-green-500 hover:text-white border-green-600 rounded-md text-green-600 text-xs transition duration-300 ease-in-out"
                            >
                                Sign Document
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-x-4 pt-5 pb-2 px-5 overflow-auto remove-scrollbar custom-srollbar">
                    {filteredSigners}
                </div>
            </div>
        </>
    )
}
