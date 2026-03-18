'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { User } from 'lucide-react'
import { MemberRow } from '../components'

interface TeamMembersModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    members: any[]
    teamName: string
}

export function TeamMembersModal({
    isOpen,
    onOpenChange,
    members,
    teamName,
}: TeamMembersModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl! p-0 overflow-hidden border shadow-2xl rounded-2xl">
                <div className="bg-primaryNew p-4 space-y-0.5 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <DialogHeader className="p-0">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2.5 text-primary-foreground">
                            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/10 shadow-sm">
                                <User className="size-4 text-white" />
                            </div>
                            <span className="text-white">
                                {teamName} Members
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-white/80 pl-10.5 font-medium">
                        Total {members.length} members
                    </p>
                </div>

                <ScrollArea className="max-h-[60vh] px-4 py-2">
                    <div className="space-y-2">
                        {members.map((m) => (
                            <MemberRow key={m.id} member={m} />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
