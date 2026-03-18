import { Select } from '@components'
import { CommonApi } from '@queries'
import React, { useState } from 'react'
import { TEAM_TAGS } from '../teams-tabs'

export const SupportTeamFilter = ({ setFilter, filter }: any) => {
    const teamsList = CommonApi.Teams.useTeamsList()
    const membersList = CommonApi.Teams.useSupportTeamMemberList()
    const teamOptions =
        teamsList?.data &&
        teamsList?.data?.length > 0 &&
        teamsList?.data?.map((team: any) => ({
            label: team?.name,
            value: team?.id,
        }))
    const memberOptions =
        membersList?.data &&
        membersList?.data?.length > 0 &&
        membersList?.data?.map((member: any) => ({
            label: member?.subadmin?.user?.name,
            value: member?.subadmin?.id,
        }))
    const statesList = CommonApi.Countries.useStatesList({})
    const stateOptions =
        statesList?.data?.data &&
        statesList?.data?.data?.length > 0 &&
        statesList?.data?.data?.map((state: any) => ({
            label: state?.name,
            value: state?.id,
        }))
    const tagsOptions = TEAM_TAGS.map((tag: any) => ({
        label: tag,
        value: tag,
    }))
    return (
        <div className="bg-white grid grid-cols-4 gap-x-2 items-center p-2 mt-3 rounded-md shadow-premium">
            {' '}
            <Select
                name="team"
                label="Filter by team"
                placeholder="Filter by team"
                options={teamOptions}
                loading={teamsList.isLoading}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        name: e?.label,
                    })
                }}
            />
            <Select
                name="member"
                label="Filter by team member"
                placeholder="Filter by team member"
                options={memberOptions}
                loading={membersList.isLoading}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        member: e?.value,
                    })
                }}
            />
            <Select
                name="state"
                label="Filter by state"
                placeholder="Filter by state"
                options={stateOptions}
                loading={statesList?.data?.isLoading}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        state: e?.value,
                    })
                }}
            />
            <Select
                name="tags"
                label="Filter by tag"
                placeholder="Filter by tag"
                options={tagsOptions}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        tag: e?.value,
                    })
                }}
            />
        </div>
    )
}
