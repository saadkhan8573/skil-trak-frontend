import { GlobalModal, Typography } from '@components'
import { MdCancel } from 'react-icons/md'
import { FillEsignFields } from '../components'

export const FillEsignFieldsModal = ({
    onCancel,
    documentId,
    signerId,
}: {
    signerId: number
    documentId: number
    onCancel: () => void
}) => {
    return (
        <GlobalModal>
            {' '}
            <div className="max-w-6xl relative flex flex-col gap-y-3 ">
                <div className="flex justify-between items-center border-b border-border px-5 py-3 shadow-profile">
                    <Typography variant="title" semibold>
                        Esign Document
                    </Typography>
                    <MdCancel
                        onClick={() => {
                            if (onCancel) {
                                onCancel()
                            }
                        }}
                        className="transition-all duration-500 text-gray-400 hover:text-black text-3xl cursor-pointer hover:rotate-90"
                    />
                </div>

                <div className=" p-10 h-[75vh] min-w-full lg:min-w-[1000px] overflow-auto custom-scrollbar">
                    <FillEsignFields
                        signerId={signerId}
                        onCancel={onCancel}
                        documentId={documentId}
                    />
                </div>
            </div>
        </GlobalModal>
    )
}
