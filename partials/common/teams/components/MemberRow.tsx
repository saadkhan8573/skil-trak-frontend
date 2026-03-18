import { useState } from 'react'
import { ManageMemberTicketsModal } from '../modals'
import { InitialAvatar, Switch } from '@components'

interface MemberRowProps {
    member: any
}

export function MemberRow({ member }: MemberRowProps) {
    const [canReceiveTickets, setCanReceiveTickets] = useState(false)
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)
    const name = member.subadmin?.user?.name || 'Unknown Member'

    return (
        <>
            <div className="flex items-center gap-4 p-1.5 rounded border bg-card hover:bg-accent/40 transition-all group border-muted/50">
                {member.subadmin?.user?.name && (
                    <InitialAvatar
                        imageUrl={member.subadmin?.user?.avatar}
                        name={member.subadmin?.user?.name}
                    />
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground/90">
                        {name}
                    </p>
                </div>

                {/* <div className="flex items-center gap-4">
                    <div className="w-[100px] flex justify-end">
                        {canReceiveTickets && (
                            <button
                                onClick={() => setIsManageModalOpen(true)}
                                className="px-3 py-1.5 bg-primaryNew text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all animate-in fade-in zoom-in duration-200"
                            >
                                Manage
                            </button>
                        )}
                    </div>{' '}
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                            Can Receive Tickets
                        </span>
                        <Switch
                            name={'canReceiveTickets'}
                            isChecked={canReceiveTickets}
                            onChange={(e: any) =>
                                setCanReceiveTickets(e.target.checked)
                            }
                            customStyleClass="profileSwitch"
                        />
                    </div>
                </div> */}
            </div>

            <ManageMemberTicketsModal
                isOpen={isManageModalOpen}
                onOpenChange={setIsManageModalOpen}
                member={member}
            />
        </>
    )
}
