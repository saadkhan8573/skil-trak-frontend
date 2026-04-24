import { Typography, useAuthorizedUserComponent } from '@components'
import { UserRoles } from '@constants'
import { useSubadminProfile } from '@hooks'
import { maskText } from '@utils'
import { getStatusColor } from './EsignListRowCard'

export const SignerCard = ({ signer }: any) => {
    // #128C7F1A

    const getPhoneNumber = (user: any) => {
        if (!user) return 'NA'

        switch (user?.role) {
            case UserRoles.INDUSTRY:
                return user.industry?.phoneNumber ?? 'NA'
            case UserRoles.STUDENT:
                return user.student?.phone ?? 'NA'
            case UserRoles.RTO:
                return user.rto?.phone ?? 'NA'
            default:
                return 'NA'
        }
    }

    const getBackgroundClass = (status: string) => {
        if (status === 'signed') {
            return 'bg-[#128C7F1A]'
        }
        return 'bg-[#24556d0d] bg-opacity-5'
    }
    const backgroundClass = getBackgroundClass(signer?.status)
    const phoneNumber = getPhoneNumber(signer?.user)

    const subadmin = useSubadminProfile()
    const isPermission = useAuthorizedUserComponent({
        roles: [UserRoles.ADMIN],
        isHod: subadmin?.departmentMember?.isHod,
    })

    return (
        <>
            <div
                className={`${backgroundClass} rounded-md px-5 py-3.5 border-dashed border border-primaryNew`}
            >
                {/* <SignersView signers={info.row.original?.signers} /> */}
                <div className="mb-2">
                    <Typography
                        variant="small"
                        bold
                        color="text-gray-400"
                        capitalize
                    >
                        {signer?.user?.role ?? 'NA'}
                    </Typography>
                </div>

                <div className="flex justify-between gap-x-5">
                    <div className="flex flex-col gap-y-1 justify-center">
                        <div>
                            <Typography variant="small" semibold>
                                {signer?.user?.name ?? 'NA'}
                            </Typography>
                        </div>

                        <div>
                            {' '}
                            {/* <Typography variant="small" color="text-gray-400">
                                {signer?.user?.role === UserRoles.INDUSTRY
                                    ? signer?.user?.industry?.phoneNumber ??
                                      'NA'
                                    : signer?.user?.role === UserRoles.STUDENT
                                    ? signer?.user?.student?.phone ?? 'NA'
                                    : signer?.user?.role === UserRoles.RTO
                                    ? signer?.user?.rto?.phone ?? 'NA'
                                    : null}
                            </Typography> */}
                        </div>
                    </div>

                    <div>
                        <div>
                            <Typography variant="xs" color="text-gray-400">
                                Status
                            </Typography>
                            <Typography
                                variant="muted"
                                color={getStatusColor(signer?.status)}
                                semibold
                            >
                                {signer?.status || 'NA'}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Typography variant="xs" color="text-gray-400">
                                Dated
                            </Typography>
                            <Typography variant="muted" semibold>
                                {signer?.updatedAt?.split(0, 10) || 'Not Found'}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
