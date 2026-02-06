import { Button, Card, Typography } from '@components'
import { useContextBar, useNavbar } from '@hooks'
import {
    CBRtoListingProfile,
    ComposeListingRtoMail,
    ListingRtoAllCommunication,
    RtoListingNotes,
} from '@partials/sub-admin'
import { SubAdminApi } from '@queries'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

export const RtoListingDetail = () => {
    const [isComposeMail, setIsComposeMail] = useState<boolean>(false)
    const contextBar = useContextBar()
    const navBar = useNavbar()

    const onCancelComposeMail = useCallback(() => {
        setIsComposeMail(false)
    }, [])

    const router = useRouter()
    const id = router.query.id as string
    const { data, isLoading, isError, isSuccess } =
        SubAdminApi.Rto.useListingRtoDetails(id, {
            skip: !id,
        })

    useEffect(() => {
        if (isSuccess) {
            contextBar.show(false)
            contextBar.setContent(<CBRtoListingProfile rto={data} />)
            navBar.setTitle(data?.businessName)
        }

        return () => {
            contextBar.setContent(null)
            navBar.setTitle('')
            contextBar.hide()
        }
    }, [data])

    return (
        <div>
            <div className="flex gap-x-5 w-full">
                <Card noPadding>
                    <div className="flex items-center justify-between border-b py-2">
                        <div className="px-5">
                            <Typography variant="label">
                                All Communications
                            </Typography>
                        </div>
                        <div className="px-5">
                            <Button
                                onClick={() => {
                                    setIsComposeMail(!isComposeMail)
                                }}
                                text="Compose"
                            />
                        </div>
                    </div>
                    <div className="overflow-auto h-96 custom-scrollbar">
                        <ListingRtoAllCommunication />
                    </div>
                </Card>
                <div
                    className={`fixed bottom-0 right-0 z-333  ${isComposeMail ? 'block' : 'hidden'
                        }`}
                >
                    <ComposeListingRtoMail
                        rto={data}
                        onCancelComposeMail={onCancelComposeMail}
                    />
                </div>
                <div className="w-2/5">
                    <RtoListingNotes />
                </div>
            </div>
        </div>
    )
}
