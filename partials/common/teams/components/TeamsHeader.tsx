import { Button } from '@components'
import { UserPlus } from 'lucide-react'
import React from 'react'

export const TeamsHeader = ({ setAddMemberOpen }: any) => {
    const addMember = () => {
        setAddMemberOpen(true)
    }
    return (
        <>
            {/* Header */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl mb-1 text-primaryNew">
                            Team Management
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your team members, roles, and permissions in
                            one place
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
