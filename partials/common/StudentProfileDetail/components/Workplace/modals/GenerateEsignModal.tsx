import { GlobalModal, LoadingAnimation, NoData, Typography } from '@components'
import { InitiateSigningModal } from '@partials/sub-admin/assessmentEvidence/modal'
import { SubAdminApi } from '@queries'
import { AssessmentEvidenceDetailType } from '@types'
import { ReactElement, useCallback, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { DocumentToRelease, ExistingFacility } from '../components'

export const GenerateEsignModal = ({
    workplace,
    courseId,
    onCancel,
}: {
    courseId: number
    onCancel: () => void
    workplace: IWorkplaceIndustries | null
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const esignDocumentsFolders = SubAdminApi.Student.esignDocumentsFolders(
        Number(workplace?.id),
        {
            skip: !workplace,
            refetchOnMountOrArgChange: true,
        }
    )

    const checkExistingIndustryRtoDoc =
        SubAdminApi.Student.checkExistingIndustryRtoDoc(Number(workplace?.id), {
            skip: !workplace,
            refetchOnMountOrArgChange: true,
        })

    const onCancelModal = () => setModal(null)

    const onInitiateSigning = useCallback(
        (folder: AssessmentEvidenceDetailType) => {
            setModal(
                <InitiateSigningModal
                    onCancel={() => {
                        onCancelModal()
                    }}
                    courseId={courseId}
                    folder={folder}
                />
            )
        },
        []
    )

    return (
        <GlobalModal>
            {modal}
            <div className="max-w-4xl rounded-lg relative flex flex-col gap-y-2 ">
                <MdCancel
                    onClick={onCancel}
                    className="transition-all duration-500 text-white hover:text-gray-300 text-3xl cursor-pointer hover:rotate-90 absolute top-2 right-2"
                />
                <div className="w-full">
                    {/* Header */}
                    <div className="bg-primaryNew-dark text-center py-4 px-6 rounded-t-lg">
                        <Typography variant="title" bold color="!text-white">
                            SUCCESSFUL APPOINTMENT
                        </Typography>
                    </div>

                    {/* Content */}
                    <div className="px-5 py-3 bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-lg">
                        {/* Sub-header */}
                        <div className="bg-green-700 text-white py-3 px-6 rounded-md">
                            <Typography
                                color="text-white"
                                center
                                block
                                variant="label"
                            >
                                Release the following documents for e-signing:
                            </Typography>
                        </div>

                        {/* Document List */}
                        {esignDocumentsFolders?.isError && (
                            <NoData
                                text="There is some technical issue!"
                                isError
                            />
                        )}
                        {esignDocumentsFolders?.isLoading ? (
                            <LoadingAnimation size={90} />
                        ) : esignDocumentsFolders?.data &&
                          esignDocumentsFolders?.data?.length > 0 ? (
                            <div className="py-3 space-y-2">
                                {esignDocumentsFolders?.data?.map(
                                    (folder: AssessmentEvidenceDetailType) => {
                                        if (folder?.isFacilityCheckList) {
                                            if (
                                                checkExistingIndustryRtoDoc?.isSuccess &&
                                                checkExistingIndustryRtoDoc
                                                    ?.data?.isExist
                                            ) {
                                                return (
                                                    <ExistingFacility
                                                        onCancel={onCancel}
                                                        existingDoc={
                                                            checkExistingIndustryRtoDoc?.data
                                                        }
                                                        workplace={workplace}
                                                        onInitiateSigning={() =>
                                                            onInitiateSigning(
                                                                folder
                                                            )
                                                        }
                                                    />
                                                )
                                            }

                                            return (
                                                <div className="relative">
                                                    {checkExistingIndustryRtoDoc?.isLoading && (
                                                        <div className="w-full  absolute top-0 left-0 inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                                                            <div className="flex flex-col items-center">
                                                                {/* Spinner */}
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/*  */}
                                                    <DocumentToRelease
                                                        folder={folder}
                                                        key={folder?.id}
                                                        onInitiateSigning={
                                                            onInitiateSigning
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                        return (
                                            <DocumentToRelease
                                                folder={folder}
                                                key={folder?.id}
                                                onInitiateSigning={
                                                    onInitiateSigning
                                                }
                                            />
                                        )
                                    }
                                )}
                            </div>
                        ) : esignDocumentsFolders?.isSuccess ? (
                            <NoData text="No Folders were found! Please create the esign templete to move forward" />
                        ) : null}
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}
