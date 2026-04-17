import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'
import { FaEdit } from 'react-icons/fa'

import { RtoApi, RtoV2Api } from '@queries'
import { Student } from '@types'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { MdBlock, MdChangeCircle } from 'react-icons/md'
import { useColumns } from './hooks'
import { AssignCoordinatorModal, BlockModal, DownloadListModal } from './modals'
import { AssignMultipleCoordinatorModal } from './modals/AssignMultipleCoordinatorModal'
import { Download } from 'lucide-react'

export const InProgressStudent = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { getTableConfig, modal: newModal } = useColumns()
    const [downloadReport, downloadState] =
        RtoV2Api.Students.useDownloadInProgressStudent()
    const { columns } = getTableConfig({
        removeColumnKeys: ['snoozed', 'sectors', 'batch'],
        actionKeys: [
            'assign',
            'block',
            'changeStatus',
            'changeExpiry',
            'changeSector',
        ],
    })

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const { isLoading, data, isError } =
        RtoApi.Students.useInProgressStudentsList({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const onModalCancelClicked = () => setModal(null)
    const onClickDownload = () => {
        setModal(
            <DownloadListModal
                onClose={onModalCancelClicked}
                downloadReport={downloadReport}
            />
        )
    }
    const onBlockClicked = (student: Student) => {
        setModal(
            <BlockModal
                item={student}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const onAssignCoordinatorClicked = (student: Student) => {
        setModal(
            <AssignCoordinatorModal
                studentId={student?.id}
                studentUser={student?.user}
                rtoCoordinatorId={student?.rtoCoordinator?.id}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const onAddMultiStudentsCoordinatorClicked = (ids: number[]) => {
        setModal(
            <AssignMultipleCoordinatorModal
                ids={ids}
                onCancel={onModalCancelClicked}
            />
        )
    }

    const quickActionsElements = {
        id: 'id',
        individual: (student: Student) => (
            <div className="flex gap-x-2">
                <ActionButton
                    Icon={FaEdit}
                    onClick={() => {
                        router.push(
                            `portals/rto/students/${student?.id}/edit-student`
                        )
                    }}
                >
                    Edit
                </ActionButton>
                <ActionButton
                    Icon={MdBlock}
                    onClick={() => {
                        onBlockClicked(student)
                    }}
                    variant="error"
                >
                    Block
                </ActionButton>
                <ActionButton
                    Icon={MdChangeCircle}
                    variant="info"
                    onClick={() => {
                        onAssignCoordinatorClicked(student)
                    }}
                >
                    {student?.rtoCoordinator
                        ? 'Change Coordinator'
                        : 'Assign Coordinator'}
                </ActionButton>
            </div>
        ),
        common: (ids: Student[]) => (
            <ActionButton
                Icon={MdChangeCircle}
                variant="info"
                onClick={() => {
                    onAddMultiStudentsCoordinatorClicked(
                        ids?.map((stu: Student) => stu?.id)
                    )
                }}
            >
                Add Coordinator
            </ActionButton>
        ),
    }

    return (
        <>
            {modal}
            {newModal}
            <div className="flex flex-col gap-y-3">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => {
                                return (
                                    <div>
                                        <div className="px-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
                                                )}
                                            <div className="flex gap-x-2">
                                                <Button
                                                    text="Download Excel"
                                                    variant="primaryNew"
                                                    outline
                                                    Icon={Download}
                                                    onClick={onClickDownload}
                                                />
                                                {quickActions}
                                                {pagination &&
                                                    pagination(
                                                        data?.pagination,
                                                        setPage
                                                    )}
                                            </div>
                                        </div>
                                        <div className="px-6 overflow-auto custom-scrollbar">
                                            {table}
                                        </div>
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize &&
                                                    pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        data?.data?.length
                                                    )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination &&
                                                        pagination(
                                                            data?.pagination,
                                                            setPage
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            }}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No In Progress Students!'}
                                description={
                                    'You have no students with an in-progress workplace request.'
                                }
                                height={'50vh'}
                            />
                        )
                    )}
                </Card>
            </div>
        </>
    )
}
