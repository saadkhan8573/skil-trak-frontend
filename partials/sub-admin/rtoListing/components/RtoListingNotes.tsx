import { Button, Card, NoData, Typography } from '@components'
import Modal from '@modals/Modal'
import { SubAdminApi } from '@queries'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import { AddRtoListingNoteModal } from '../modal'

export const RtoListingNotes = () => {
    const router = useRouter()
    const id = router.query.id

    // futureindustries/id/notes/list-all
    const { data, isLoading, isError } = SubAdminApi.Rto.useGetRtoListingNotes(
        id,
        {
            skip: !id,
        }
    )

    return (
        <>
            <Card noPadding>
                <div className="flex items-center pb-2 border-b py-2 px-4">
                    <div className="flex-1">
                        <Typography variant="label">Notes</Typography>
                    </div>
                    <div className="shrink-0">
                        <Modal>
                            <Modal.Open opens="addRtoListingNote">
                                <Button text="Add Note" />
                            </Modal.Open>
                            <Modal.Window name="addRtoListingNote">
                                <AddRtoListingNoteModal />
                            </Modal.Window>
                        </Modal>
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
