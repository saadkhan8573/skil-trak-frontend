import {
    InitialAvatar,
    LoadingAnimation,
    NoData,
    Portal,
    Typography,
} from '@components'
import { CommonApi } from '@queries'
import moment from 'moment'
import { CiStickyNote } from 'react-icons/ci'
import { MdCancel } from 'react-icons/md'
import { ListingNoteCard } from '../components'

export const ViewNoteModal = ({
    industry,
    onCancel,
}: {
    onCancel: () => void
    industry: any
}) => {
    const notes = CommonApi.FindWorkplace.viewListingNoew(industry?.id)
    const noteDetailData = [
        {
            text: 'Industry Name',
            data: industry?.businessName,
        },
        {
            text: 'Contact By',
            data: industry?.contactedBy?.name || '---',
        },
        {
            text: 'Contact At',
            data: moment(industry?.contactedAt).format('MMM DD, YYYY'),
        },
    ]

    return (
        <Portal>
            <div className="fixed z-[99999999] bg-black/25 backdrop-blur-sm w-full h-full top-0 left-0 flex items-center justify-center">
                <div className="relative w-full md:w-3/4 lg:w-[600px]  bg-gray-200 p-6 shadow-2xl rounded-2xl">
                    <MdCancel
                        onClick={onCancel}
                        className="absolute top-3 right-3 transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />
                    <div className="flex flex-col gap-y-4">
                        <div className="flex justify-center">
                            <CiStickyNote
                                className="text-[#24556D]"
                                size={40}
                            />
                        </div>

                        {notes?.isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            <div className="flex flex-col gap-y-2 max-h-[50vh] overflow-auto px-2">
                                {notes?.data && notes?.data?.length > 0 ? (
                                    notes?.data?.map((note: any) => (
                                        <ListingNoteCard
                                            key={note?.id}
                                            note={note}
                                        />
                                    ))
                                ) : notes?.isSuccess ? (
                                    <div className="bg-gray-100">
                                        <NoData text="No Note were added" />
                                    </div>
                                ) : null}
                                {industry?.note ? (
                                    <ListingNoteCard
                                        note={{
                                            ...industry,
                                            comment: industry?.note,
                                        }}
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    )
}
