import { useRouter } from 'next/router'

// Icons
import { FaEye } from 'react-icons/fa'

// components
import {
    StudentJobId,
    TableAction,
    Typography,
    UserCreatedAt,
} from '@components'

// types
import { Result } from '@constants'
import { RTOCellInfo } from '@partials/sub-admin/rto/components'
import { getUserCredentials, setLink } from '@utils'
import { ReactElement, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { BsArchiveFill } from 'react-icons/bs'
import { ArchiveModal, AssessmentCellInfo, DeleteModal } from '../components'

export const useColumns = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)
    const subadminId = getUserCredentials()?.id

    const onModalCancelClicked = () => {
        setModal(null)
    }
    const onArchiveClicked = (student: any) => {
        setModal(
            <ArchiveModal item={student} onCancel={onModalCancelClicked} />
        )
    }
    const onDeleteClicked = (student: any) => {
        setModal(<DeleteModal item={student} onCancel={onModalCancelClicked} />)
    }
    const insertSpacesBetweenWords = (text: string) => {
        if (!text) return ''
        return text.replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    const tableActionOptions = (student: any) => {
        const data = [
            ...(student?.student?.subadmin?.user?.id === subadminId
                ? [
                      {
                          text: 'View',
                          onClick: (item: any) => {
                              router.push({
                                  pathname: `/portals/sub-admin/students/${item?.student?.id}/detail`,
                                  query: {
                                      tab: 'submissions',
                                      course: item?.course?.id,
                                  },
                              })
                              setLink('subadmin-student', router)
                          },
                          Icon: FaEye,
                          color: 'text-blue-500 hover:bg-blue-100 hover:border-blue-200',
                      },
                  ]
                : []),
            {
                text:
                    student.status === Result.Archived
                        ? 'Un-archive'
                        : 'Archive',
                onClick: (student: any) => onArchiveClicked(student),
                Icon: BsArchiveFill,
                color: 'text-blue-500 hover:bg-blue-100 hover:border-blue-200',
            },
            {
                text: 'Delete',
                onClick: (student: any) => onDeleteClicked(student),
                Icon: AiFillDelete,
                color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
            },
        ]

        return data
    }

    const columns = [
        {
            header: () => 'Job ID',
            accessorKey: 'studentMaskedId',
            cell: ({ row }: any) => (
                <StudentJobId
                    studentJobId={row?.original?.student?.studentMaskedId!}
                />
            ),
        },
        {
            header: () => 'Name',
            accessorKey: 'user',
            sort: true,
            cell: ({ row }: any) => <AssessmentCellInfo item={row.original} />,
        },
        {
            header: () => 'Course',
            accessorKey: 'course',
            cell: ({ row }: any) => {
                const course = row.original?.course
                return (
                    <div className="flex flex-col justify-center">
                        <Typography variant={'small'} color={'text-gray-500'}>
                            {course?.sector?.name}
                        </Typography>
                        <Typography variant={'label'}>
                            {course?.title}
                        </Typography>
                    </div>
                )
            },
        },
        {
            header: () => 'RTO',
            accessorKey: 'rto1',
            cell: ({ row }: any) => (
                <RTOCellInfo
                    rto={row?.original?.student?.rto}
                    onlyName={false}
                />
            ),
        },
        {
            header: () => 'Result',
            accessorKey: 'result',
            cell: ({ row }: any) => (
                <Typography variant={'label'} capitalize>
                    {insertSpacesBetweenWords(row.original?.result)}
                </Typography>
            ),
        },
        {
            header: () => 'Submission Type',
            accessorKey: 'autoSubmission',
            cell: ({ row }: any) => (
                <Typography variant={'label'} capitalize>
                    {row.original?.autoSubmission ? 'Auto' : 'Manual'}
                </Typography>
            ),
        },
        {
            header: () => 'Submitted On',
            accessorKey: 'result',
            cell: ({ row }: any) => (
                <UserCreatedAt createdAt={row.original?.createdAt} />
            ),
        },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => {
                const tableActionOption = tableActionOptions(row.original)
                return (
                    <TableAction
                        options={tableActionOption}
                        rowItem={row.original}
                    />
                )
            },
        },
    ]
    return { columns, modal }
}
