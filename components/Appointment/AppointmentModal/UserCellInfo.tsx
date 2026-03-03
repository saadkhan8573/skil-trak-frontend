import { InitialAvatar } from '@components/InitialAvatar'
import { Typography } from '@components/Typography'
import { UserRoles } from '@constants'
import { useMaskText } from '@hooks'
import { User } from '@types'
import { ellipsisText, maskText } from '@utils'
import { State } from 'country-state-city'
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'

export const UserCellInfo = ({ user }: { user: User }) => {
    const profile: any = user
        ? user[
              user?.role === 'subadmin'
                  ? ('coordinator' as keyof typeof user)
                  : (user?.role as keyof typeof user)
          ]
        : {}

    const userProfile = user
        ? user?.role === UserRoles.SUBADMIN
            ? profile && profile?.length > 0
                ? profile[0]
                : profile
            : profile
        : {}

    const stateCodes = State.getStatesOfCountry('AU')?.map(
        (state) => state?.isoCode
    )

    return (
        <div className="flex items-center relative">
            <div className="flex items-center gap-x-2">
                <div>
                    {user?.name && (
                        <InitialAvatar
                            name={user?.name}
                            imageUrl={user?.avatar}
                        />
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-x-2">
                        <Typography variant={'muted'} color={'text-gray-700'}>
                            {ellipsisText(profile?.studentId, 8)}
                        </Typography>
                    </div>
                    <Typography variant={'subtitle'} color={'text-gray-800'}>
                        {user?.name} ({user?.role}){' '}
                    </Typography>
                    <div className="flex items-center gap-x-2 text-sm">
                        <FaEnvelope className="text-gray-400" />
                        <Typography variant={'label'} color={'text-gray-500'}>
                            {useMaskText({
                                key: user?.email,
                            })}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-x-2 text-sm">
                        <FaPhone className="text-gray-400" />
                        <Typography variant={'label'} color={'text-gray-500'}>
                            {useMaskText({
                                key:
                                    userProfile?.phone ||
                                    userProfile?.phoneNumber,
                            })}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-x-2 text-sm">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <Typography variant={'label'} color={'text-gray-500'}>
                            {userProfile?.isAddressUpdated
                                ? userProfile?.addressLine1
                                : `${profile?.addressLine1
                                      ?.replace(/Australia/i, '')
                                      ?.replace(
                                          new RegExp(
                                              stateCodes?.join('|'),
                                              'g'
                                          ),
                                          ''
                                      )} ${
                                      profile?.suburb
                                          ?.replace(/Australia/i, '')
                                          ?.replace(
                                              new RegExp(
                                                  stateCodes?.join('|'),
                                                  'g'
                                              ),
                                              ''
                                          ) || ''
                                  } ${profile?.state || ''}, Australia`}
                        </Typography>
                    </div>
                    {user?.role === UserRoles.INDUSTRY ? (
                        <div className="mt-3">
                            <Typography variant={'xs'}>
                                Contact Person
                            </Typography>
                            <div className="flex items-center gap-x-2 text-sm">
                                <Typography variant={'small'}>
                                    <span className="font-bold">
                                        {userProfile?.contactPerson || 'N/A'}
                                    </span>
                                </Typography>
                            </div>
                            <div className="flex items-center gap-x-2 text-sm">
                                <FaPhone className="text-gray-400 text-xs" />
                                <Typography
                                    variant={'small'}
                                    color={'text-gray-500'}
                                >
                                    {maskText(
                                        userProfile?.contactPersonNumber
                                    ) || 'N/A'}
                                </Typography>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
