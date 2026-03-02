import { CreatedAtDate, Typography } from '@components'
import { AdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { Course } from '@types'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCheck } from 'react-icons/hi'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { DataKpiTable } from '../../DataKpiTable'
import { useColumnsAction } from '../../hooks'

export const Completed = ({
    startDate,
    endDate,
}: {
    startDate: Moment | null
    endDate: Moment | null
}) => {
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(20)

    const { columnAction, modal } = useColumnsAction()

    const completedColumns: ColumnDef<
        IWorkplaceIndustries & { course: Course }
    >[] = [
        {
            accessorKey: 'student.studentId',
            header: 'Student ID',
        },
        {
            accessorKey: 'student.user.name',
            header: 'Name',
        },
        {
            accessorKey: 'courses',
            header: 'COURSES',
            cell: (info) => (
                <div>
                    <Typography variant="small" normal>
                        {info?.row?.original?.course?.code}
                    </Typography>
                    <Typography variant="label" normal>
                        {info?.row?.original?.course?.title}
                    </Typography>
                </div>
            ),
        },
        {
            accessorKey: 'completedDate',
            header: 'Completed Date',
            cell: (info) => (
                <CreatedAtDate createdAt={info.row?.original?.createdAt} />
            ),
        },
        ...(columnAction as ColumnDef<
            IWorkplaceIndustries & { course: Course }
        >[]),
    ]

    const workplace = AdminApi.Kpi.completedDetails(
        {
            limit: itemPerPage,
            id: Number(router.query.id),
            skip: itemPerPage * page - itemPerPage,
            search: `startDate:${moment(startDate).format(
                'YYYY-MM-DD'
            )},endDate:${moment(endDate).format('YYYY-MM-DD')}`,
        },
        {
            skip: !router.query.id || !startDate || !endDate,
        }
    )

    return (
        <>
            {modal}
            <DataKpiTable
                colors="red"
                Icon={HiCheck}
                title="Completed"
                columns={completedColumns}
                data={workplace}
                setPage={setPage}
                setItemPerPage={setItemPerPage}
            />
        </>
    )
}
