import {
    ActionButton,
    Card,
    EmptyData,
    LoadingAnimation,
    Table,
    TableChildrenProps,
    TechnicalError,
} from '@components'
import { AdminApi } from '@queries'
import { Industry, UserStatus } from '@types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdBlock } from 'react-icons/md'
import { useColumns } from './hooks'
import { MultiBlockModal } from './modals'

export const NonPartnerIndustries = () => {
    const router = useRouter()
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1)
    const [isRouting, setIsRouting] = useState(true)

    // hooks
    const { getTableConfig, modal: hookModal, passwordModal } = useColumns()
    const [modal, setModal] = useState<any>(null)

    const { columns } = getTableConfig({
        columnKeys: [
            'businessName',
            'abn',
            'contactPerson',
            'favoriteBy',
            'createdBy',
            'action',
            "placementStatus"
        ],
        actionKeys: [
            'view',
            'viewOldProfile',
            'edit',
            'viewPassword',
            'archive',
            'block',
        ],
    })

    useEffect(() => {
        if (!isRouting) return
        const newPage = Number(router.query.page)
        const newItemPerPage = Number(router.query.pageSize)
        if (router.query.page) {
            setPage(newPage)
        }
        if (router.query.pageSize) {
            setItemPerPage(newItemPerPage)
        }
    }, [router])

    const { isLoading, isFetching, data, isError } =
        AdminApi.Industries.useListQuery({
            search: `nonPartner:${true},status:${UserStatus.Approved}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        })

    const hasCourseApproved =
        data?.data &&
        data?.data?.length > 0 &&
        data?.data?.filter(
            (item: any) =>
                item.hasOwnProperty(item?.hasCourseApproved) &&
                !item?.hasCourseApproved
        )

    const onModalCancelClicked = () => {
        setModal(null)
    }

    const onMultiBlockClicked = (industries: Industry[]) => {
        setModal(
            <MultiBlockModal
                industries={industries}
                onCancel={() => onModalCancelClicked()}
            />
        )
    }

    const quickActionsElements = {
        id: 'id',
        individual: (id: Industry) => (
            <div className="flex gap-x-2">
                <ActionButton>Edit</ActionButton>
                <ActionButton variant="error">Block</ActionButton>
            </div>
        ),
        common: (industries: Industry[]) => (
            <>
                <ActionButton
                    onClick={() => {
                        onMultiBlockClicked(industries)
                    }}
                    Icon={MdBlock}
                    variant="error"
                >
                    Block
                </ActionButton>
            </>
        ),
    }

    return (
        <>
            {modal && modal}
            {hookModal && hookModal}
            {passwordModal && passwordModal}
            <div className="flex flex-col gap-y-4 mb-32">
                <Card noPadding>
                    {isError && <TechnicalError />}
                    {isLoading || isFetching ? (
                        <LoadingAnimation height="h-[60vh]" />
                    ) : data && data?.data?.length ? (
                        <Table
                            columns={columns}
                            data={data.data}
                            quickActions={quickActionsElements}
                            hasCourseApproved={hasCourseApproved}
                            enableRowSelection
                        >
                            {({
                                table,
                                pagination,
                                pageSize,
                                quickActions,
                            }: TableChildrenProps) => (
                                <div>
                                    <div className="p-6 mb-2 flex justify-between">
                                        {pageSize &&
                                            pageSize(
                                                itemPerPage,
                                                (e) => {
                                                    setItemPerPage(e)
                                                    setIsRouting(false)
                                                },
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
                                    <div className=" overflow-x-scroll remove-scrollbar">
                                        <div className="px-6 w-full">
                                            {table}
                                        </div>
                                    </div>
                                    {data?.data?.length > 10 && (
                                        <div className="p-6 mb-2 flex justify-between">
                                            {pageSize &&
                                                pageSize(
                                                    itemPerPage,
                                                    (e) => {
                                                        setItemPerPage(e)
                                                        setIsRouting(false)
                                                    },
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
                            )}
                        </Table>
                    ) : (
                        !isError && (
                            <EmptyData
                                title={'No Approved Industry!'}
                                description={
                                    'You have not approved any Industry request yet'
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
