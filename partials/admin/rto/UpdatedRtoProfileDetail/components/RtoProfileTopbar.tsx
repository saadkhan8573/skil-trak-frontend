import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, HideRestrictedData, Typography } from '@components'
import { FaChevronDown, FaFileImport, FaUserGraduate } from 'react-icons/fa'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { SubAdminApi } from '@queries'
import { Zap } from 'lucide-react'
import { StartMatchingAutoWP } from '@partials/rto-v2/dashboard/modal'
import { ReactElement } from 'react'

export const RtoProfileTopbar = ({ rtoUserId }: { rtoUserId: number }) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()

    const role = getUserCredentials()?.role

    const onCancel = () => setModal(null)

    return (
        <>
            {modal}
            <Card noPadding shadowType="profile">
                <div className="flex justify-between items-center py-3 px-3.5">
                    <div>
                        <Typography semibold>
                            <span className="text-[15px]">
                                RTO Students Details
                            </span>
                        </Typography>
                    </div>

                    <HideRestrictedData type="canAddStudents">
                        <div className="flex gap-x-2">
                            <Button
                                Icon={Zap}
                                text="Start Matching"
                                onClick={() =>
                                    setModal(
                                        <StartMatchingAutoWP
                                            onCancel={onCancel}
                                            rtoUserId={rtoUserId}
                                        />
                                    )
                                }
                            />
                            <div className="flex items-center gap-x-3">
                                <div
                                    className="relative"
                                    onMouseEnter={() => setShowDropDown(true)}
                                    onMouseLeave={() => setShowDropDown(false)}
                                >
                                    <Button>
                                        <span
                                            id="add-students"
                                            className="flex items-center gap-x-2"
                                        >
                                            <span>Add Students</span>
                                            <FaChevronDown />
                                        </span>
                                    </Button>

                                    {showDropDown ? (
                                        <ul className="bg-white shadow-xl rounded-xl overflow-hidden absolute">
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            role ===
                                                            UserRoles.ADMIN
                                                        ) {
                                                            router.push(
                                                                `/portals/admin/rto/${router?.query?.id}/student-list`
                                                            )
                                                        } else if (
                                                            role ===
                                                            UserRoles.SUBADMIN
                                                        ) {
                                                            router.push({
                                                                pathname: `/portals/sub-admin/users/rtos/${rtoUserId}/student-list`,
                                                                query: {
                                                                    rtoId: router
                                                                        ?.query
                                                                        ?.id,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                                >
                                                    <span className="text-gray-500">
                                                        <FaFileImport />
                                                    </span>
                                                    <span className="whitespace-nowrap">
                                                        {' '}
                                                        Import Students
                                                    </span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            role ===
                                                            UserRoles.ADMIN
                                                        ) {
                                                            router.push(
                                                                `/portals/admin/rto/${router?.query?.id}/add-individual-student`
                                                            )
                                                        } else if (
                                                            role ===
                                                            UserRoles.SUBADMIN
                                                        ) {
                                                            router.push(
                                                                `/portals/sub-admin/users/rtos/${router?.query?.id}/add-individual-student`
                                                            )
                                                        }
                                                    }}
                                                    className="w-full flex items-center gap-x-2 text-sm px-2 py-2 hover:bg-gray-200"
                                                >
                                                    <span className="text-gray-500">
                                                        <FaUserGraduate />
                                                    </span>
                                                    <span> Add Individual</span>
                                                </button>
                                            </li>
                                        </ul>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </HideRestrictedData>
                </div>
            </Card>
        </>
    )
}
