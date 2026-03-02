import { Course } from '@types'
import { useState } from 'react'
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'
import moment, { Moment } from 'moment'
import { useColumnsAction } from '../../hooks'
import { ColumnDef } from '@tanstack/react-table'
import { DataKpiTable } from '../../DataKpiTable'
import { RiGitPullRequestFill } from 'react-icons/ri'
import { CreatedAtDate, Typography } from '@components'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const WorkplaceRequest = ({
    endDate,
    startDate,
}: {
    startDate: Moment | null
    endDate: Moment | null
}) => {
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)

    const { columnAction, modal } = useColumnsAction()

    const workplace = AdminApi.Kpi.workplaceDetails(
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

    const workplaceColumns: ColumnDef<
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
            accessorKey: 'student.phone',
            header: 'Phone',
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
            accessorKey: 'workplaceRequestDate',
            header: 'Workplace Request Date',
            cell: (info) => (
                <CreatedAtDate createdAt={info.row?.original?.createdAt} />
            ),
        },
        ...(columnAction as ColumnDef<
            IWorkplaceIndustries & { course: Course }
        >[]),
    ]

    return (
        <div className="">
            {modal}
            <DataKpiTable
                colors="blue"
                setPage={setPage}
                setItemPerPage={setItemPerPage}
                data={workplace}
                title="Workplace Request"
                columns={workplaceColumns}
                Icon={RiGitPullRequestFill}
            />
        </div>
    )
}
