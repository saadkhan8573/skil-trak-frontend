import { CommonApi } from '@queries'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { PuffLoader } from 'react-spinners'
import { SignersStatus } from './components'
import { ESignTitleCards } from './ESignTitleCards'
import { useEffect, useMemo, useState } from 'react'
import { Card, NoData, PageSize, Pagination } from '@components'

export const ESignatures = () => {
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [selectedFolder, setSelectedFolder] = useState<any>(null)

    const pendingDocuments = CommonApi.ESign.usePendingDocumentsList(
        {
            status: 'signed',
            skip: itemPerPage * page - itemPerPage,
            limit: itemPerPage,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    )

    const role = getUserCredentials()?.role

    const otherAllUserSigned = useMemo(
        () =>
            pendingDocuments?.data?.data?.filter((agreement: any) =>
                agreement.signers
                    ?.filter((signer: any) => signer?.user?.role !== 'rto')
                    ?.every((signer: any) => signer.status === 'signed')
            ),
        [pendingDocuments?.data?.data]
    )

    useEffect(() => {
        if (
            pendingDocuments.isSuccess &&
            pendingDocuments?.data?.data &&
            pendingDocuments?.data?.data?.length > 0
        ) {
            if (role === UserRoles.RTO) {
                setSelectedFolder(otherAllUserSigned?.[0])
            } else {
                setSelectedFolder(pendingDocuments?.data?.data?.[0])
            }
        }
    }, [pendingDocuments, otherAllUserSigned])

    return (
        <>
            {/* <AssessmentCourseCard /> */}
            <div className="flex flex-col gap-y-3 lg:flex-row gap-x-2">
                <div className="w-full lg:w-[33%]">
                    <div className="flex items-center justify-between">
                        <PageSize
                            itemPerPage={itemPerPage}
                            setItemPerPage={setItemPerPage}
                            records={pendingDocuments?.data?.data?.length}
                        />
                        <Pagination
                            pagination={pendingDocuments.data?.pagination}
                            setPage={setPage}
                        />
                    </div>
                    <Card noPadding>
                        <div className="lg:min-h-[370px]">
                            {pendingDocuments.isError && (
                                <NoData
                                    text={'There is some technical issue!'}
                                    isError
                                />
                            )}
                            {pendingDocuments.isLoading ||
                            pendingDocuments.isFetching ? (
                                <div className="min-h-[inherit] flex justify-center items-center">
                                    <PuffLoader />
                                </div>
                            ) : pendingDocuments?.isSuccess &&
                              pendingDocuments.data?.data &&
                              pendingDocuments?.data?.data?.length > 0 ? (
                                <ESignTitleCards
                                    selectedFolder={selectedFolder}
                                    pendingDocuments={
                                        pendingDocuments?.data?.data
                                    }
                                    setSelectedFolder={(e: any) => {
                                        setSelectedFolder(e)
                                    }}
                                />
                            ) : (
                                pendingDocuments.isSuccess && (
                                    <NoData text="There is no document list" />
                                )
                            )}
                        </div>
                    </Card>
                </div>
                <div className="w-full lg:w-[67%]">
                    <Card noPadding>
                        {selectedFolder ? (
                            // <WorkplaceAgreementDetail
                            //     selectedFolder={selectedFolder}
                            // />
                            <SignersStatus selectedFolder={selectedFolder} />
                        ) : (
                            <div className="h-80 p-5">
                                <NoData text="No Document Selected" />
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    )
}
