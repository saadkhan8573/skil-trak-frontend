import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@components/ui/dialog'
import { Badge } from '@components'
import { Student } from '@types'
import Link from 'next/link'

interface RecentMatchesModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    matches: Student[]
}

export const RecentMatchesModal = ({
    isOpen,
    onOpenChange,
    matches,
}: RecentMatchesModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl!">
                <DialogHeader>
                    <DialogTitle>Recent Matches</DialogTitle>
                    <DialogDescription>
                        All matches from the last 24 hours
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
                    {matches?.map((match) => (
                        <Link
                            href={`/portals/rto/students-and-placements/all-students/${match?.id}/detail`}
                            key={match?.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-primaryNew/5 border border-border/50 hover:border-success/30 transition-all hover:bg-success/5 group/item cursor-pointer "
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate group-hover/item:text-success transition-colors">
                                    {match?.user?.name} {match?.familyName}
                                </p>
                                {/* <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {match.industry}
                                    </p> */}
                            </div>
                            {/* <Badge
                                text={match.match}
                                className="bg-success/10 text-success border-success/20 text-xs font-medium px-2.5 py-0.5"
                            /> */}
                        </Link>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
