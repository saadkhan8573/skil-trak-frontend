// components
import {
    TechnicalError,
    LoadingAnimation,
    EmptyData,
    PageSize,
    Pagination,
} from '@components'

// queries
import { AdminApi } from '@queries'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { AdminWorkplaceRequest } from './components'
import { IWorkplaceIndustries } from '@redux/queryTypes'

export const AllStudentProvidedWorkplace = () => {
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(30)

    const subAdminWorkplace = AdminApi.Workplace.useStudentProvidedWorkplace(
        {
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    useEffect(() => {
        setPage(Number(router.query.page || 1))
        setItemPerPage(Number(router.query.pageSize || 30))
    }, [router])

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <PageSize
                    itemPerPage={itemPerPage}
                    setItemPerPage={setItemPerPage}
                    records={subAdminWorkplace?.data?.data?.length}
                />
                <Pagination
                    pagination={subAdminWorkplace?.data?.pagination}
                    setPage={setPage}
                />
            </div>
            {subAdminWorkplace.isError && <TechnicalError />}
            {subAdminWorkplace.isLoading && subAdminWorkplace.isFetching ? (
                <LoadingAnimation />
            ) : subAdminWorkplace.data?.data &&
              subAdminWorkplace.data?.data?.length > 0 ? (
                <div className="flex flex-col gap-y-4">
                    {subAdminWorkplace?.data?.data?.map(
                        (workplace: IWorkplaceIndustries) => (
                            <AdminWorkplaceRequest
                                key={workplace?.id}
                                workplace={workplace}
                            />
                        )
                    )}
                </div>
            ) : (
                !subAdminWorkplace.isError && (
                    <EmptyData
                        title={'No Provided Workplace Request'}
                        description={'No Provided Workplace Request were found'}
                    />
                )
            )}
            {subAdminWorkplace.data?.data &&
                subAdminWorkplace.data?.data?.length > 7 && (
                    <div className="flex items-center justify-between py-7">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={subAdminWorkplace.data?.data?.length}
                        />
                        <Pagination
                            pagination={subAdminWorkplace?.data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                )}
        </div>
    )
}
