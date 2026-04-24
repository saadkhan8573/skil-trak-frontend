import {
    Button,
    OutsideClickHandler,
    SidebarCalendar,
    StudentJobId,
    Typography,
    UserCreatedAt,
    WorldwideStudentDataRestriction,
} from '@components'
import {
    ApprovedBy,
    CompleteTask,
    TableColumn,
    TodoTable,
} from '@partials/common/todoList'
import { SubAdminApi } from '@queries'
import { User } from '@types'
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'

export const TodoAppointments = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [filterDate, setFilterDate] = useState<Date | null>(null)

    const data = SubAdminApi.Todo.useManagerTodoAppointments({
        search: `${JSON.stringify({
            date: moment(filterDate || new Date()).format('yyyy-MM-DD'),
        })
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        limit: itemsPerPage,
        skip: itemsPerPage * currentPage - itemsPerPage,
    })

    const columns: TableColumn<any>[] = [
        {
            key: 'studentMaskedId',
            header: 'Job ID',
            width: '120px',
            render: (value) => <StudentJobId studentJobId={value} />,
        },
        {
            key: 'studentId',
            header: 'Student ID',
            width: '140px',
            className: 'font-medium',
            render: (value, row) => (
                <Link href={`/portals/sub-admin/students/${row?.id}/detail`}>
                    <Typography variant="label" cursorPointer>
                        {value}
                    </Typography>
                </Link>
            ),
        },
        {
            key: 'appointmentfor',
            header: 'Name',
            width: '200px',
            render: (value, row) => (
                <WorldwideStudentDataRestriction
                    fallbackOptions={{
                        width: '80px',
                        height: '20px',
                    }}
                    anotherUserId={row?.rto?.user?.id}
                >
                    <Typography variant="label">{value}</Typography>
                </WorldwideStudentDataRestriction>
            ),
        },
        {
            key: 'date',
            header: 'Due Date',
            width: '120px',
            render: (value) => <UserCreatedAt createdAt={value} />,
        },
        {
            key: 'overDue',
            header: 'Over Due',
            width: '120px',
            render: (value: string) => (
                <div className="cursor-pointer">
                    {value ? 'Over Due' : '---'}
                </div>
            ),
        },
        {
            key: 'approvedBy',
            header: 'Approved By',
            width: '100px',
            render: (value: string, row) =>
                row?.actionbyid ? (
                    <ApprovedBy
                        user={
                            {
                                id: row?.actionbyid,
                                name: row?.actionbyname,
                                email: row?.actionbyemail,
                            } as User
                        }
                    />
                ) : (
                    '---'
                ),
        },
        {
            key: 'status',
            header: 'Action',
            width: '100px',
            render: (value: string, row) => (
                <CompleteTask data={row} text={'Complete Appointment Task'} />
            ),
        },
    ]
    const handleDatesChange = (date: Date) => {
        setFilterDate(date)
    }
    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setShowFilter(false)}>
                <div className="relative">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                setShowFilter(!showFilter)
                            }}
                            text="Filter"
                            variant="action"
                        />
                    </div>
                    {showFilter && (
                        <div className="absolute top-full right-0 bg-white mt-2 w-80">
                            <SidebarCalendar
                                setSelectedDate={handleDatesChange}
                            />
                        </div>
                    )}
                </div>
            </OutsideClickHandler>
            <TodoTable
                data={data}
                columns={columns}
                title="Appointments"
                statusCounts={{
                    done: data?.data?.completed,
                    remaining: data?.data?.remaining,
                }}
                onClose={() => console.log('Close clicked')}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </>
    )
}
