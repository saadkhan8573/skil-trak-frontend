import {
    AuthorizedUserComponent,
    Select,
    ShowErrorNotifications,
} from '@components'
import { UserRoles } from '@constants'
import { CommonApi } from '@queries'
import React, { useState } from 'react'

export const TicketAssigneeSelector = ({ taskId, teamId, member }: any) => {
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [changeAssignee, changeAssigneeResult] =
        CommonApi.Teams.useChangeSupportTicketAssignee()
    const membersList = CommonApi.Teams.useSupportTeamMembersByTeam(teamId, {
        skip: !teamId,
    })
    const memberOptions =
        membersList?.data &&
        membersList?.data?.length > 0 &&
        membersList?.data?.map((member: any) => ({
            label: member?.subadmin?.user?.name,
            value: member?.subadmin?.id,
        }))
    const selectedAssignee = memberOptions?.find(
        (member: any) => member?.value === member?.id
    )
    return (
        <>
            <ShowErrorNotifications result={changeAssigneeResult} />
            <AuthorizedUserComponent roles={[UserRoles.ADMIN]}>
                <div className="overflow-visible relative z-50">
                    <Select
                        name="assignee"
                        placeholder="Change assignee"
                        options={memberOptions}
                        label={'Assignee'}
                        loading={
                            membersList.isLoading ||
                            changeAssigneeResult.isLoading
                        }
                        value={member?.id}
                        defaultValue={selectedAssignee ?? null}
                        onChange={(e: any) => {
                            if (!e) return // ⛔ ignore clear

                            changeAssignee({
                                coordId: e,
                                taskId,
                            })
                        }}
                        disabled={changeAssigneeResult.isLoading}
                        onlyValue
                        showError={false}
                    />
                </div>
            </AuthorizedUserComponent>
        </>
    )
}
