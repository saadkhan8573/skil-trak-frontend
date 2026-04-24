import { InitialAvatar, WorldwideStudentDataRestriction } from '@components'
import { useSubadminProfile } from '@hooks'
import { getUserCredentials, setLink } from '@utils'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const AssessmentCellInfo = ({ item }: { item: any }) => {
    const router = useRouter()
    const subadminId = getUserCredentials()?.id

    const subadmin = useSubadminProfile()

    return (
        <div className="flex items-center relative">
            <div className="flex items-center gap-x-2">
                <WorldwideStudentDataRestriction
                    fallbackOptions={{
                        width: '20px',
                        height: '20px',
                    }}
                    anotherUserId={item?.student?.rto?.user?.id}
                >
                    {' '}
                    {item?.student?.user?.name && (
                        <div>
                            <InitialAvatar
                                name={item?.student?.user?.name}
                                imageUrl={item?.student?.user?.avatar}
                            />
                        </div>
                    )}
                </WorldwideStudentDataRestriction>

                <Link
                    href={
                        item?.student?.subadmin?.user?.id === subadminId ||
                        subadmin?.isManager ||
                        subadmin?.departmentMember?.isHod ||
                        subadmin?.isAssociatedWithRto
                            ? {
                                  pathname: `/portals/sub-admin/students/${item?.student?.id}/detail`,
                              }
                            : '#'
                    }
                    onClick={() => {
                        setLink('subadmin-student', router)
                    }}
                >
                    <WorldwideStudentDataRestriction
                        fallbackOptions={{
                            width: '100px',
                            height: '20px',
                        }}
                        anotherUserId={item?.student?.rto?.user?.id}
                    >
                        <p className="text-gray-800 font-medium">
                            {item?.student?.user?.name}
                        </p>
                    </WorldwideStudentDataRestriction>
                </Link>
            </div>
        </div>
    )
}
