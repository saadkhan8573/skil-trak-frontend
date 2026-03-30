import { Button, Card, NoData, Typography } from '@components'
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog'
import { CommonApi } from '@queries'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { AddNoteModal } from '../modal'

export const IndustryListingNotes = () => {
    const router = useRouter()
    const id = router.query.id
    const [isOpen, setIsOpen] = useState(false)

    // futureindustries/id/notes/list-all
    const { data, isLoading, isError } =
        CommonApi.FindWorkplace.useIndustryListingNotes(id, {
            skip: !id,
        })

    return (
        <>
            <Card noPadding>
                <div className="flex items-center pb-2 border-b py-2 px-4">
                    <div className="flex-1">
                        <Typography variant="label">Notes</Typography>
                    </div>
                    <div className="shrink-0">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button text="Add Note" />
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl!">
                                <AddNoteModal
                                    onCloseModal={() => setIsOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col gap-y-3 px-4 py-2 h-96 overflow-auto custom-scrollbar">
                    {isError && <NoData text="something went wrong" />}
                    {isLoading ? (
                        <PulseLoader />
                    ) : data?.length > 0 ? (
                        data?.map((note: any) => (
                            <div className="bg-[#FFDCDC] p-3 rounded-lg">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: note?.comment,
                                    }}
                                    className="block remove-text-bg"
                                />
                            </div>
                        ))
                    ) : (
                        !isError && <NoData text="No Data Found" />
                    )}

                    {/* <NoteCard key={1} note={'Notes'} /> */}
                </div>
            </Card>
        </>
    )
}
