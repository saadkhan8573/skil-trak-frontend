import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Select,
    Table,
    TableAction,
    TableActionOption,
    TableChildrenProps,
    TechnicalError,
    Typography,
} from '@components'
import { adminApi, AdminApi } from '@queries'
import { ColumnDef } from '@tanstack/react-table'
import { checkListLength, removeEmptyValues } from '@utils'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import { BulkDeleteModal, DeleteModal } from '../components'
import { OptionType } from '@types'
import Link from 'next/link'
export const PublishedBlogs = () => {
    const [itemPerPage, setItemPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()
    const { data, isLoading, isError, isFetching } = adminApi.useGetBlogsQuery({
        isPublished: `${true}`,
        search: `${JSON.stringify(
            removeEmptyValues({
                category: router?.query?.category,
            })
        )
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '')
            .trim()}`,
        skip: itemPerPage * page - itemPerPage,
        limit: itemPerPage,
    })
    const blogsCategories = AdminApi.Blogs.categoriesList({
        skip: 0,
        limit: 100,
    })

    const categoriesOptions = blogsCategories?.data?.data?.map(
        (category: any) => ({
            label: category?.title,
            value: category?.id,
        })
    )

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onDeleteClicked = (blog: any) => {
        setModal(
            <DeleteModal blog={blog} onCancel={() => onModalCancelClicked()} />
        )
    }
    const onBulkDeleteClicked = (ids: any) => {
        setModal(
            <BulkDeleteModal onCancel={onModalCancelClicked} blogsIds={ids} />
        )
    }
    const tableActionOptions: TableActionOption<any>[] = [
        {
            text: 'View',
            onClick: (blog: any) => {
                router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs/${blog?.slug}`)
            },
            Icon: FaEye,
        },
        {
            text: 'Edit',
            onClick: (blog: any) => {
                router.push(`/portals/admin/blogs/${blog?.slug}`)
            },
            Icon: FaEdit,
        },
        {
            text: 'Delete',
            onClick: (blog: any) => onDeleteClicked(blog),
            Icon: FaTrash,
            color: 'text-red-500 hover:bg-red-100 hover:border-red-200',
        },
    ]

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'title',
            // cell: (info: any) => {
            //     return <div>{info?.row?.original?.title}</div>
            // },
            cell: (info: any) => (
                <Link
                    target="_blank"
                    className="hover:underline font-medium"
                    href={`/blogs/${info.row?.original?.slug}`}
                >
                    {info?.row?.original?.title}
                </Link>
            ),
            header: () => <span>Title</span>,
        },

        {
            accessorKey: 'createdAt',
            header: () => <span>Created At</span>,
            cell: (info) => {
                return (
                    <>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'Do MMM YYYY'
                                )}
                            </span>
                        </Typography>
                        <Typography variant={'small'} color={'text-gray-600'}>
                            <span className="font-semibold whitespace-pre">
                                {moment(info?.row?.original?.createdAt).format(
                                    'hh:mm:ss a'
                                )}
                            </span>
                        </Typography>
                    </>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            cell: (info) => {
                const length = checkListLength<any>(data?.data)

                return (
                    <div className="flex gap-x-1 items-center">
                        <TableAction
                            options={tableActionOptions}
                            rowItem={info.row.original}
                            lastIndex={length.includes(info.row?.index)}
                        />
                    </div>
                )
            },
        },
    ]

    const quickActionsElements = {
        id: 'id',
        individual: (blog: any) => {
            return (
                <div className="flex gap-x-2">
                    <ActionButton
                        onClick={() => {
                            router.push(
                                `https://www.skiltrak.com.au/blogs/${blog?.title}/${blog?.id}`
                            )
                        }}
                    >
                        View
                    </ActionButton>
                    <ActionButton
                        Icon={FaEdit}
                        onClick={() => {
                            router.push(`/portals/admin/blogs/${blog?.id}`)
                        }}
                    >
                        Edit
                    </ActionButton>
                    <ActionButton
                        Icon={FaTrash}
                        variant="error"
                        onClick={() => {
                            onDeleteClicked(blog)
                        }}
                    >
                        Delete
                    </ActionButton>
                </div>
            )
        },
        common: (ids: any) => (
            <div className="flex gap-x-2">
                <ActionButton
                    onClick={() => {
                        const arrayOfIds = ids?.map((id: any) => id?.id)
                        onBulkDeleteClicked(arrayOfIds)
                    }}
                    Icon={FaTrash}
                    variant="error"
                >
                    Delete
                </ActionButton>
            </div>
        ),
    }

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 50))
    }, [router])
    return (
        <>
            {modal}
            <div className="">
                <div className="flex justify-end">
                    <div className="w-80">
                        <Select
                            name={'category'}
                            label={'Category'}
                            options={categoriesOptions}
                            onlyValue
                            value={categoriesOptions?.find(
                                (cate: OptionType) =>
                                    cate?.value ===
                                    Number(router?.query?.category)
                            )}
                            onChange={(e: number) => {
                                router.push({
                                    pathname: router?.pathname,
                                    query: {
                                        ...router?.query,
                                        category: e,
                                    },
                                })
                            }}
                        />
                    </div>
                </div>
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data?.data}
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
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize
                                                ? pageSize(
                                                    itemPerPage,
                                                    setItemPerPage,
                                                    data?.data?.length
                                                )
                                                : null}
                                            <div className="flex gap-x-2">
                                                {quickActions}
                                                {pagination
                                                    ? pagination(
                                                        data?.pagination,
                                                        setPage
                                                    )
                                                    : null}
                                            </div>
                                        </div>
                                        <div className=" overflow-x-scroll remove-scrollbar">
                                            <div className="px-6 w-full">
                                                {table}
                                            </div>
                                        </div>
                                        {data?.data?.length > 10 && (
                                            <div className="p-6 mb-2 flex justify-between">
                                                {pageSize
                                                    ? pageSize(
                                                        itemPerPage,
                                                        setItemPerPage,
                                                        data?.data?.length
                                                    )
                                                    : null}
                                                <div className="flex gap-x-2">
                                                    {quickActions}
                                                    {pagination
                                                        ? pagination(
                                                            data?.pagination,
                                                            setPage
                                                        )
                                                        : null}
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
                                title={'No Published Blog(s)!'}
                                description={
                                    'You have no published blog(s) yet.'
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
