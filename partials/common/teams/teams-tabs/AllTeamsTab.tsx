import React, { ReactElement, useState } from 'react'
import {
    Button,
    Card,
    EmptyData,
    Select,
    Table,
    TableSkeleton,
    TechnicalError,
} from '@components'
import { CommonApi } from '@queries'
import { Briefcase, Plus } from 'lucide-react'
import { useSupportTeamColumns } from '../hooks'
import {
    CreateRtoTeamModal,
    CreateTeamModal,
    DeleteSupportTeamModal,
} from '../modals'
import { SupportTeamFilter } from '../components'

export const AllTeamsTab = () => {
    const [createTeamOpen, setCreateTeamOpen] = useState(false)
    const [createRtoTeamOpen, setCreateRtoTeamOpen] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [filter, setFilter] = useState({
        name: '',
        member: '',
        state: '',
        tag: '',
    })
    const [editData, setEditData] = useState<any>(null)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [page, setPage] = useState(1)

    const buildSearchParams = (filter: any) => {
        return Object.fromEntries(
            Object.entries(filter).filter(
                ([_, value]) =>
                    value !== '' && value !== null && value !== undefined
            )
        )
    }
    const searchParams = buildSearchParams(filter)

    const { data, isLoading, isError } = CommonApi.Teams.useAllSupportTeams({
        search: `${JSON.stringify(searchParams)
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })

    const onCancel = () => {
        setModal(null)
    }
    const onDeleteClicked = (team: any) => {
        setModal(<DeleteSupportTeamModal team={team} onCancel={onCancel} />)
    }
    const onClickEdit = (team: any) => {
        setCreateTeamOpen(true)
        setEditData(team)
    }

    const onClickAddRtoTeam = () => {
        setCreateRtoTeamOpen(true)
    }

    const { columns } = useSupportTeamColumns({
        onDeleteClicked: onDeleteClicked,
        onClickEdit: onClickEdit,
    })

    return (
        <>
            {modal && modal}
            <SupportTeamFilter setFilter={setFilter} filter={filter} />
            <Card className="border-primary/20 shadow-premium-lg bg-linear-to-br from-primaryNew/5 via-background to-primaryNew/5 overflow-hidden mt-3">
                <div className="border-b flex items-center justify-between border-primary/10 relative pb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-linear-to-br from-primaryNew to-primaryNew flex items-center justify-center shadow-premium">
                            <Briefcase className="size-5 text-white" />
                        </div>
                        <div className="">
                            <h1 className="text-lg font-bold">
                                Manage Your Teams
                            </h1>
                            <p className="text-gray-400 text-xs">
                                Organize your team into departments for better
                                management and task distribution.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setCreateRtoTeamOpen(true)}
                            className="gap-2 bg-linear-to-r from-accent to-warning hover:shadow-premium transition-all"
                            variant='primaryNew'
                        >
                            <Plus className="h-5 w-5" />
                            Add RTO Team
                        </Button>
                        <Button
                            onClick={() => setCreateTeamOpen(true)}
                            className="gap-2 bg-linear-to-r from-accent to-warning hover:shadow-premium transition-all"
                        >
                            <Plus className="h-5 w-5" />
                            Add New Team
                        </Button>
                    </div>
                </div>

                <div className="">
                    {/* Teams Table */}
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <TableSkeleton arrayLength={10} />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data?.data}
                            // quickActions={quickActionsElements}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: any) => {
                                return (
                                    <div>
                                        <div className="p-4 mb-1 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
                                                    data?.pagination,
                                                    setPage
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-4 pb-4">{table}</div>
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Team found!'}
                                description={'You have no team'}
                                height={'60vh'}
                                imageUrl="/images/icons/not-found.png"
                            />
                        )
                    )}
                </div>
                <CreateTeamModal
                    createTeamOpen={createTeamOpen}
                    setCreateTeamOpen={() => {
                        setCreateTeamOpen(false)
                        setEditData(null)
                    }}
                    editData={editData}
                />
                <CreateRtoTeamModal
                    createTeamOpen={createRtoTeamOpen}
                    setCreateTeamOpen={() => {
                        setCreateRtoTeamOpen(false)
                        setEditData(null)
                    }}
                    editData={editData}
                />
                {/* createRtoTeamOpen */}
            </Card>
        </>
    )
}
