import { Button } from '@components'
import React, { useState } from 'react'
import { XCircle } from 'lucide-react'
import { CancelWorkplaceModal } from '@partials/rto-v2/student-detail/components/AllWorkplaces/modals'

export const AdminCancelCell = ({ wpId }: { wpId: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="flex items-center justify-center">
            {isModalOpen && (
                <CancelWorkplaceModal
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    workplaceId={wpId}
                />
            )}
            <Button
                variant="error"
                outline
                onClick={() => setIsModalOpen(true)}
                className="w-full max-w-[120px] h-9"
                Icon={XCircle}
                text="Cancel"
            />
        </div>
    )
}
