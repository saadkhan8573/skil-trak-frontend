import {
    EmptyData,
    LoadingAnimation,
    PageSize,
    Pagination,
    TechnicalError,
    TextInput,
} from '@components'
import { HistoryDates } from '@partials/common'
import { RtoV2Api } from '@queries'
import { getCommonDates } from '@utils'
import { debounce } from 'lodash'
import React, { useCallback, useState } from 'react'

export const StudentRecentActivities = () => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(50)
    const [searchedValue, setSearchedValue] = useState<string>('')

    const recentActivities = RtoV2Api.Students.rtoStudentHistory(
        {
            search: `title:${searchedValue}`,
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const dates = getCommonDates(recentActivities?.data?.data)

    const delayedSearch = useCallback(
        debounce((value) => setSearchedValue(value), 700),
        []
    )

    return (
        <div>
            <div className="p-2 bg-gray-100 rounded-md border border-gray-200">
                <div className="flex items-center justify-between">
                    <PageSize
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                        records={recentActivities?.data?.data?.length}
                    />
                    <Pagination
                        pagination={recentActivities?.data?.pagination}
                        setPage={setPage}
                    />
                </div>

                <div className="min-w-32">
                    <TextInput
                        name={'history'}
                        showError={false}
                        placeholder={'Search History...'}
                        onChange={(e: any) => delayedSearch(e.target.value)}
                    />
                </div>
            </div>

            {recentActivities?.isError && <TechnicalError />}
            {recentActivities?.isLoading || recentActivities?.isFetching ? (
                <LoadingAnimation />
            ) : recentActivities?.data?.data &&
              recentActivities?.data?.data?.length > 0 ? (
                <div className="px-5 -mt-8">
                    {dates?.map((date: Date, i: number) => (
                        <HistoryDates
                            key={String(date)}
                            date={date}
                            history={recentActivities?.data?.data}
                            // filterType={filterType}
                            // customRangeDate={customRangeDate}
                        />
                    ))}
                </div>
            ) : (
                !recentActivities?.isError && (
                    <EmptyData
                        title={'No Title were found'}
                        description={
                            'It may be due to you have perform any action yet'
                        }
                    />
                )
            )}
        </div>
    )
}
