import {
    AuthorizedUserComponent,
    Button,
    Card,
    EmptyData,
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Table,
    TableAction,
    TableActionOption,
    TechnicalError,
    Typography,
} from '@components'
import { useContextBar } from '@hooks'
import { IndustryApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import React, { ReactElement, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { AddSupervisor } from './form'
import { Industry } from '@types'
import { DeleteModal } from './modal'
import { Waypoint } from 'react-waypoint'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { LuPlus } from 'react-icons/lu'
import { PulseLoader } from 'react-spinners'
import { InfoCard } from './components'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { UserRoles } from '@constants'

export const Supervisor = ({ industry }: { industry?: Industry }) => {
    const [isViewed, setIsViewed] = useState<boolean>(false)
    const [showSupervisorList, setShowSupervisorList] = useState<boolean>(false)

    const [itemPerPage, setItemPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({})
    const [modal, setModal] = useState<ReactElement | null>(null)

    const contextBar = useContextBar()

    const supervisors = IndustryApi.Supervisor.useGetSupervisor(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
            industry: industry?.user?.id,
        },
        { skip: !isViewed }
    )

    const onCancelClicked = () => {
        setModal(null)
    }

    const onEditSupervisor = (supervisor: Industry) => {
        contextBar.setTitle('Edit Supervisor')
        contextBar.show()
        contextBar.setContent(
            <AddSupervisor
                initialValues={supervisor}
                industry={industry}
                edit
                onCloseModal={contextBar.hide}
            />
        )
    }

    const onDeleteClicked = (supervisor: any) => {
        setModal(
            <DeleteModal onCancel={onCancelClicked} supervisor={supervisor} />
        )
    }

    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'Edit',
            onClick: (supervisor: any) => {
                onEditSupervisor(supervisor)
            },
            Icon: FaEdit,
        },
        {
            text: 'Delete',
            onClick: async (supervisor: any) => {
                onDeleteClicked(supervisor)
            },
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const onClickShowSupervisorList = () => {
        setShowSupervisorList(!showSupervisorList)
    }

    return (
        <Waypoint
            onEnter={() => {
                setIsViewed(true)
            }}
        >
            <div className="">
                {modal}

                <div id="add-admin">
                    <div className=" gap-x-2 border rounded-md p-2.5 items-center justify-between shadow-lg relative w-full">
                        <div className="flex items-center gap-x-2 justify-between w-full">
                            <Typography variant={'label'}>
                                Supervisors
                            </Typography>
                            <div className="flex items-center gap-x-1">
                                <AuthorizedUserComponent
                                    roles={[
                                        UserRoles.SUBADMIN,
                                        UserRoles.ADMIN,
                                        UserRoles.INDUSTRY,
                                    ]}
                                    isAssociatedWithRto={false}
                                >
                                    <div
                                        onClick={() => {
                                            contextBar.setTitle(
                                                'Add Supervisor'
                                            )
                                            contextBar.show()
                                            contextBar.setContent(
                                                <AddSupervisor
                                                    industry={industry}
                                                    onCloseModal={contextBar.hide}
                                                />
                                            )
                                        }}
                                        className="border rounded-md p-1 cursor-pointer"
                                    >
                                        <LuPlus />
                                    </div>
                                </AuthorizedUserComponent>
                                <div
                                    onClick={onClickShowSupervisorList}
                                    className="border rounded-md p-1 cursor-pointer"
                                >
                                    <MdKeyboardArrowDown
                                        className={`transition-all duration-300 ${showSupervisorList
                                            ? 'rotate-180'
                                            : 'rotate-0'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${showSupervisorList ? 'block' : 'hidden'
                                }  top-11 z-40 left-0 transition-all max-h-60 overflow-auto custom-scrollbar duration-300 bg-white border rounded-md px-4 py-2 w-full`}
                        >
                            <div className="">
                                {supervisors.isError ? (
                                    <NoData
                                        simple
                                        text="There is technical issue!"
                                        isError
                                    />
                                ) : null}
                                {supervisors.isLoading ? (
                                    <PulseLoader size={6} />
                                ) : supervisors?.data &&
                                    supervisors?.data?.data?.length ? (
                                    <div className="space-y-2">
                                        {supervisors?.data?.data?.map(
                                            (supervisor: any) => (
                                                <div
                                                    key={supervisor?.id}
                                                    className="p-2 flex flex-col gap-y-2 bg-[#24556D1A] bg-opacity-10 border border-[#A5A3A9] rounded-md"
                                                >
                                                    <InfoCard
                                                        title={
                                                            'Supervisor Name'
                                                        }
                                                        data={supervisor?.name}
                                                    />
                                                    <InfoCard
                                                        title={'Email'}
                                                        data={supervisor?.email}
                                                    />
                                                    <InfoCard
                                                        title={'Phone Number'}
                                                        data={supervisor?.phone}
                                                    />
                                                    <InfoCard
                                                        title={'Qualification'}
                                                        data={
                                                            supervisor?.qualification
                                                        }
                                                    />
                                                    <div className="flex items-center gap-x-2 justify-center">
                                                        <div
                                                            onClick={() => {
                                                                onDeleteClicked(
                                                                    supervisor
                                                                )
                                                            }}
                                                            className="bg-primaryNew p-2 rounded-md cursor-pointer"
                                                        >
                                                            <RiDeleteBin6Line className="text-white" />
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                onEditSupervisor(
                                                                    supervisor
                                                                )
                                                            }}
                                                            className="bg-primaryNew p-2 rounded-md cursor-pointer"
                                                        >
                                                            <CiEdit className="text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center p-3 text-[10px] whitespace-nowrap text-gray-400 border-2 border-dashed border-gray-200 rounded-md">
                                        No supervisors found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Waypoint>
    )
}
