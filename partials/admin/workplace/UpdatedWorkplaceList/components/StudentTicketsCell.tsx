import { Button } from '@components'
import { ViewTicketsModal } from '@partials/common'
import React, { useState } from 'react'
import { BiMessageRoundedDots } from 'react-icons/bi'

export const StudentTicketsCell = ({
    wpId,
    ticketsCount,
}: {
    wpId: number
    ticketsCount: number
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="flex items-center justify-center">
            {isModalOpen && (
                <ViewTicketsModal
                    wpId={wpId}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            <Button
                variant="primaryNew"
                onClick={() => setIsModalOpen(true)}
                className="w-full max-w-[120px]"
                outline
                Icon={BiMessageRoundedDots}
                text={
                    ticketsCount > 0
                        ? `Tickets (${ticketsCount})`
                        : 'View Tickets'
                }
            />
        </div>
    )
}
