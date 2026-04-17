import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TechnicalError,
} from '@components'
import { FaEdit } from 'react-icons/fa'

import { RtoApi } from '@queries'
import { Student } from '@types'
import { getUserCredentials } from '@utils'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdBlock, MdChangeCircle } from 'react-icons/md'
import { useColumns } from './hooks'
export const IncompleteSubmissionStudent = () => {
    const router = useRouter()
    const [isExcelDownload, setIsExcelDownload] = useState<boolean>(false)
    const userId = getUserCredentials()?.id

    const exportList = RtoApi.Students.useExportStudentList(
        {
            status: `active`,
            userId,
        },
        { skip: !isExcelDownload }
    )

    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)

    const { isLoading, data, isError, refetch } =
        RtoApi.Students.incompleteSubmissionStudents({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    // Download excel
    useEffect(() => {
        if (exportList?.data?.file?.data && exportList?.isSuccess) {
            const buffer = Buffer.from(exportList.data.file.data)
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            saveAs(blob)
            setIsExcelDownload(false)
        }
    }, [exportList?.data, exportList?.isSuccess])

    useEffect(() => {
        if (exportList?.isError) {
            setIsExcelDownload(false)
        }
    }, [exportList?.isError])

    const {
        getTableConfig,
        modal,
        onBlockClicked,
        onAssignCoordinatorClicked,
        onAddMultiStudentsCoordinatorClicked,
    } = useColumns()

    const { columns } = getTableConfig({
        actionKeys: ['assign', 'block', 'changeStatus', 'changeExpiry'],
    })

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
                            }: any) => {
                                return (
                                    <div>
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize(
                                                itemPerPage,
                                                setItemPerPage,
                                                data?.data?.length
                                            )}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination(
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
                                                {pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
                                                )}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination(
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
                                title={'No Incomplete Submission!'}
                                description={
                                    'You have not Incomplete Submission found'
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
