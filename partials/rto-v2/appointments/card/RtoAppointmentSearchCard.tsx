import {
    LoadingAnimation,
    NoData,
    PageSize,
    Pagination,
    TextInput,
} from '@components'
import { RtoApi, useSearchSubAdminUsersQuery } from '@queries'
import { getUserCredentials } from '@utils'
import { debounce } from 'lodash'
import React, { useCallback, useState } from 'react'
import { RtoSearchedUserCard } from './RtoSearchedUserCard'

export const RtoAppointmentSearchCard = ({
    role,
    setSelectedUser,
    selectedUser,
}: any) => {
    const [search, setSearch] = useState('')
    const [searchValue, setSearchValue] = useState<string>('')

    // RTK query call
    const rtoUsers = RtoApi.Appointments.useRtoSearchedUsers(
        {
            search,
            role,
            // skip: itemPerPage * page - itemPerPage,
            // limit: itemPerPage,
        },
        {
            skip: !search,
        }
    )
    const delayedSearchFor = useCallback(
        debounce((values: string) => {
            setSearch(values)
        }, 700),
        []
    )

    const onFilterChange = (value: any) => {
        delayedSearchFor(value)
    }
    return (
        <div>
            {' '}
            <TextInput
                label={`Search by Name/Email`}
                name={'name'}
                placeholder={'Search BY Name/Email...'}
                validationIcons
                required
                onChange={(e: any) => {
                    setSearchValue(e.target.value)
                    onFilterChange(e.target.value)
                }}
                // value={searchValue}
            />
            {rtoUsers.isError && (
                <NoData
                    text={`There is some network issue, please refresh your browser`}
                />
            )}
            {/* {rtoUsers?.data?.data && rtoUsers?.data?.data?.length > 0 && (
                <div className="flex items-center justify-between">
                    <PageSize
                        itemPerPage={itemPerPage}
                        setItemPerPage={setItemPerPage}
                    />
                    <Pagination
                        pagination={
                            rtoUsers?.data?.pagination
                        }
                        setPage={setPage}
                    />
                </div>
            )} */}
            <div className="flex flex-col gap-y-2">
                {rtoUsers.isLoading || rtoUsers.isFetching ? (
                    <LoadingAnimation />
                ) : search && rtoUsers?.data && rtoUsers?.data?.length > 0 ? (
                    rtoUsers?.data?.map((user: any) => (
                        <>
                            <RtoSearchedUserCard
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                user={user}
                            />
                        </>
                    ))
                ) : (
                    !rtoUsers.isError &&
                    rtoUsers.isSuccess && <NoData text={`Not Found`} />
                )}
            </div>
        </div>
    )
}
