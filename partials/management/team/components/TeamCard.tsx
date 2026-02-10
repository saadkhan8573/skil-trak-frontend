import { OutsideClickHandler, ShowErrorNotifications, TextInput, Typography } from '@components'
import { DashedCountCard } from '@partials/management/components'
import Link from 'next/link'
import React, { useState, ReactElement, useEffect } from 'react'
import { DeleteTeamModal } from '../modal'
import { MdDeleteOutline } from 'react-icons/md'
import { CiEdit } from 'react-icons/ci'
import { ManagementApi } from '@queries'
import { useNotification } from '@hooks'


export const TeamCard = ({ team }: any) => {
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [teamName, setTeamName] = useState('')
    const { notification } = useNotification()
    const [updateTeamName, updateTeamNameResult] =
        ManagementApi.Team.useUpdateTeamName()
    const onCancel = () => {
        setModal(null)
    }
    const onDeleteTeam = () => {
        setModal(<DeleteTeamModal item={team} onCancel={onCancel} />)
    }
    useEffect(() => {
        if (updateTeamNameResult.isSuccess) {
            notification.success({
                title: 'Updated Successfully',
                description: 'Team name updated successfully',
            })
        }
    }, [updateTeamNameResult])
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newTeamName = e.currentTarget.value
            setEditMode(false)
            updateTeamName({ id: team?.id, body: { name: newTeamName } })
        }
    }

    return (
        <>
            {modal && modal}
            <ShowErrorNotifications result={updateTeamNameResult} />
            <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col gap-y-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3">
                        {editMode ? (
                            <>
                                <OutsideClickHandler
                                    onOutsideClick={() => {
                                        setEditMode(false)
                                    }}
                                >
                                    <input
                                        name="name"
                                        placeholder="Enter team & press enter"
                                        className="outline rounded-sm text-sm px-3 py-2 outline-gray-300"
                                        defaultValue={team?.name}
                                        onKeyDown={handleKeyDown}
                                    />
                                </OutsideClickHandler>
                            </>
                        ) : (
                            <>
                                <Typography variant="small" bold>
                                    {team?.name || 'N/A'}
                                </Typography>
                                <div
                                    onClick={() => setEditMode(true)}
                                    className="cursor-pointer"
                                >
                                    <CiEdit className="text-blue-500" />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="cursor-pointer" onClick={onDeleteTeam}>
                        <MdDeleteOutline className="text-red-400" />
                    </div>
                </div>
                <div className="flex items-center gap-x-1">
                    <Typography variant="small">Team Members :</Typography>
                    <Typography variant="small" bold>
                        {team?.membersCount || 0}
                    </Typography>
                </div>

                <div className="bg-[#F5F4FF] border-2 border-dashed px-3 py-2 rounded-md">
                    <Typography variant="small" color="text-primaryNew" bold>
                        {team?.members?.[0]?.subadmin?.user?.name ||
                            'No member added yet'}
                    </Typography>

                    <Typography variant="small" color="text-[#25516C]">
                        {team?.members && team?.members?.length > 0
                            ? 'TEAM LEAD'
                            : '-'}
                    </Typography>
                </div>

                <div className="flex items-center gap-x-2 w-full">
                    <DashedCountCard
                        title="Team KPI"
                        subtitle={team?.members?.[0]?.kpiReportsCount || 0}
                        align="center"
                    />
                    <DashedCountCard
                        title="KPI Doubling"
                        subtitle={
                            team?.members?.[0]?.kpiReportsCount
                                ?.kpiDuplicationsCount || 0
                        }
                        align="center"
                    />
                </div>

                <Link
                    href={`/portals/management/teams/${team?.id}`}
                    className="text-blue-400 text-sm mt-3"
                >
                    View All Details-&gt;
                </Link>
            </div>
        </>
    )
}
