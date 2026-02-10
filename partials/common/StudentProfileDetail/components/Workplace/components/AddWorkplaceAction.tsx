import { Button, OutsideClickHandler } from '@components'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'

import { CompleteProfileBeforeWpModal } from '../modals'
import { useWorkplace } from '@hooks'

export const AddWorkplaceAction = ({
    id,
    text,
    profileCompletion,
    onButtonClick,
}: {
    onButtonClick?: () => boolean
    id: number
    text?: string
    profileCompletion: number
}) => {
    const router = useRouter()
    const [addWorkplace, setAddWorkplace] = useState<boolean>(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { workplaceRto } = useWorkplace()

    const workplaceActions = [
        {
            key: 'own',
            text: 'Add Provided Workplace',
            type: 'provide-workplace-detail?tab=abn',
            onClick: () => {
                router.push({
                    pathname: `/portals/sub-admin/students/${id}/provide-workplace-detail`,
                    query: { tab: 'abn' },
                })
            },
        },
        {
            key: 'need',
            text: 'Add Requested Workplace',
            type: 'request-workplace-detail',
            onClick: () => {
                router.push(
                    `/portals/sub-admin/students/${id}/request-workplace-detail`
                )
            },
        },
    ]

    const canAddOwnWorkplace = Boolean(workplaceRto?.canAddOwnWorkplace)
    const canAddNeedWorkplace = Boolean(workplaceRto?.canAddNeedWorkplace)
    const hasAnyPermission = canAddOwnWorkplace || canAddNeedWorkplace

    const allowedKeys: Array<'own' | 'need'> = []
    if (canAddOwnWorkplace) allowedKeys.push('own')
    if (canAddNeedWorkplace) allowedKeys.push('need')
    const filteredActions = workplaceActions.filter((a: any) =>
        allowedKeys.includes(a.key)
    )

    const onCancelClicked = () => setModal(null)

    const onCompleteProfileClicked = (type: string) => {
        setModal(
            <CompleteProfileBeforeWpModal
                onCancel={onCancelClicked}
                workplaceType={type}
            />
        )
    }
    return (
        <>
            {modal}
            <div className="relative">
                <Button
                    text={text || 'Add Workplace'}
                    onClick={() => {
                        if (onButtonClick && onButtonClick()) {
                            onButtonClick()
                        } else if (id) {
                            setAddWorkplace((workplace: boolean) => !workplace)
                        }
                    }}
                    disabled={!id || !hasAnyPermission}
                />
                {addWorkplace && filteredActions.length > 0 && (
                    <OutsideClickHandler
                        onOutsideClick={() => {
                            setAddWorkplace(false)
                        }}
                    >
                        <div className="absolute right-0 z-20 mt-2 bg-white py-2 shadow-lg rounded">
                            {filteredActions.map(({ text, type, onClick }) => (
                                <p
                                    key={text}
                                    className="whitespace-pre text-sm text-gray-600 font-medium py-2 border-b border-gray-200 cursor-pointer px-2 hover:bg-gray-200"
                                    onClick={() => {
                                        if (profileCompletion === 100) {
                                            onClick()
                                        } else if (profileCompletion < 100) {
                                            onCompleteProfileClicked(type)
                                        }
                                        setAddWorkplace(false)
                                    }}
                                >
                                    {text}
                                </p>
                            ))}
                        </div>
                    </OutsideClickHandler>
                )}
            </div>
        </>
    )
}
