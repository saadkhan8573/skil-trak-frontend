import {
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
import Link from 'next/link'
import React, { useState } from 'react'

export const TodoStudents = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const data = SubAdminApi.Todo.useManagerTodoStudents({
        search: '',
        limit: itemsPerPage,
        skip: itemsPerPage * currentPage - itemsPerPage,
    })

    const columns: TableColumn<any>[] = [
        {
            key: 'student.studentMaskedId',
            header: 'Job ID',
            width: '120px',
            render: (value) => <StudentJobId studentJobId={value} />,
        },
        {
            key: 'student.user.name',
            header: 'Name',
            width: '200px',
            render: (value, row) => (
                <WorldwideStudentDataRestriction
                    fallbackOptions={{
                        width: '80px',
                        height: '20px',
                    }}
                    anotherUserId={row?.student?.rto?.user?.id}
                >
                    {value}
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

    return (
        <>
            <TodoTable
                data={data}
                columns={columns}
                title="Students"
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
