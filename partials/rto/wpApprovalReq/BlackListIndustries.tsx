import { ReactElement, useEffect, useState } from 'react'
// Layouts
import { RTOWorkplaceFormFilter } from '@types'
//components
import {
    ActionButton,
    Button,
    Card,
    EmptyData,
    Filter,
    InitialAvatar,
    LoadingAnimation,
    RTOWorkplaceFilters,
    SetDetaultQueryFilteres,
    Table,
    TableAction,
    TechnicalError,
} from '@components'
// Links
import Link from 'next/link'
// Queries
import { RtoApi } from '@queries'
// Next Image
import { RemoveFromBlackListModal } from '@partials/rto/BlackListedIndustries'
import { ColumnDef } from '@tanstack/react-table'
import { RtoApprovalWorkplaceRequest } from '@types'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { FaFileExport } from 'react-icons/fa'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'
import { WPApprovalCourseRequirementModal } from './modal'

type Props = {}

const filterKeys = [
    'studentId',
    'name',
    'email',
    'location',
    'subAdminId',
    'industryId',
    'courseId',
]

export const BlackListIndustries = () => {
    const router = useRouter()
    const [modal, setModal] = useState<ReactElement | null>(null)

    const [filterAction, setFilterAction] = useState(null)
    const [filter, setFilter] = useState<RTOWorkplaceFormFilter>(
        {} as RTOWorkplaceFormFilter
    )
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const userId = getUserCredentials()?.id

    const { isLoading, data, isError } =
        RtoApi.Industry.getBlackListedIndustries({
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])

    const onCancel = () => setModal(null)

    const onRemoveFromBlackList = (wpRequest: any) => {
        setModal(
            <RemoveFromBlackListModal
                onCancel={onCancel}
                wpRequest={wpRequest}
            />
        )
    }

    const onViewCourseRequirement = (wpAppReq: RtoApprovalWorkplaceRequest) => {
        setModal(
            <WPApprovalCourseRequirementModal
                wpAppReq={wpAppReq}
                onCancel={onCancel}
            />
        )
    }

    const columns: ColumnDef<any>[] = [
        {
            header: () => 'Industry Name',
            accessorKey: 'name',
            cell: ({ row }: any) => {
                const {
                    phoneNumber,
                    user: { name = 'Saad', email = 'Saad', avatar },
                } = row.original?.industry
                return (
                    <Link
                        href={`/portals/rto/industries/workplaces/${row?.original?.industry?.id}`}
                        className="flex items-center gap-x-2"
                    >

                        <div className="shadow-inner-image rounded-full relative">
                            <InitialAvatar name={name} imageUrl={avatar} />
                        </div>
                        <div>
                            <p className="font-semibold">{name}</p>
                            <div className="font-medium text-xs text-gray-500">
                                <p className="flex items-center gap-x-1">
                                    <span>
                                        <MdEmail />
                                    </span>
                                    {email}
                                </p>
                                <p className="flex items-center gap-x-1">
                                    <span>
                                        <MdPhoneIphone />
                                    </span>
                                    {phoneNumber}
                                </p>
                            </div>
                        </div>

                    </Link>
                );
            },
        },
        {
            header: () => 'Abn',
            accessorKey: 'industry.abn',
        },
        {
            header: () => 'Address',
            accessorKey: 'address',
            cell: ({ row }) => {
                const { addressLine1, addressLine2 } = row.original?.industry
                return `${addressLine1} ${addressLine2}`
            },
        },
        // {
        //     accessorKey: 'requirement',
        //     header: () => <span>Requirement</span>,
        //     cell: (info) => (
        //         <ActionButton
        //             onClick={() => {
        //                 onViewCourseRequirement(info?.row?.original)
        //             }}
        //             variant="info"
        //         >
        //             View Course
        //         </ActionButton>
        //     ),
        // },
        {
            header: () => 'Action',
            accessorKey: 'Action',
            cell: ({ row }: any) => (
                <TableAction
                    rowItem={row.original}
                    options={[
                        {
                            text: 'Remove From Black List',
                            onClick: (wpRequest) =>
                                onRemoveFromBlackList(wpRequest),
                            Icon: '',
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <>
            {modal}
            <SetDetaultQueryFilteres
                filterKeys={filterKeys}
                setFilter={setFilter}
            />
            <div className="mb-5">
                <Filter<RTOWorkplaceFormFilter>
                    component={RTOWorkplaceFilters}
                    initialValues={filter}
                    filterKeys={filterKeys}
                    setFilterAction={setFilterAction}
                    setFilter={setFilter}
                />
                <div className="flex justify-end">
                    {data && data?.data?.length ? (
                        <>
                            <a
                                href={`${process.env.NEXT_PUBLIC_END_POINT}/rtos/workplaces/download/${userId}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button
                                    text={'Export'}
                                    variant={'action'}
                                    Icon={FaFileExport}
                                />
                            </a>
                        </>
                    ) : null}
                </div>
            </div>
            <Card noPadding>
                {isError && <TechnicalError />}
                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : data && data?.data?.length ? (
                    <Table<any> columns={columns} data={data?.data}>
                        {({
                            table,
                            pagination,
                            pageSize,
                            quickActions,
                        }: any) => {
                            return (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize(itemPerPage, setItemPerPage)}
                                        <div className="flex gap-x-2">
                                            {quickActions}
                                            {pagination(
                                                data?.pagination,
                                                setPage
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6">{table}</div>
                                </div>
                            )
                        }}
                    </Table>
                ) : (
                    !isError && (
                        <EmptyData
                            title={'No Workplaces!'}
                            description={
                                'it seems that there is no workplace request'
                            }
                            height={'50vh'}
                        />
                    )
                )}
            </Card>
        </>
    )
}
