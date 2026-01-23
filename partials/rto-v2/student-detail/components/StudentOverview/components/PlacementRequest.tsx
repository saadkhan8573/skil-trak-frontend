import { LoadingAnimation, NoData } from '@components'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { WorkplaceSmallCard } from '../card'

export function PlacementRequest({
    studentWorkplaces,
    sortedWorkplaces
}: {
    sortedWorkplaces: IWorkplaceIndustries[]
    studentWorkplaces: any
}) {

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Compact Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-slate-900">Placement Requests</h3>
                {/* <Button variant="action" className="text-xs py-1.5 px-3">
                    <FileText className="w-3 h-3 mr-1" />
                    New Request
                </Button> */}
            </div>

            {studentWorkplaces?.isError ? (
                <NoData text="There is some technical issue!" isError />
            ) : null}

            {studentWorkplaces?.isLoading ? (
                <LoadingAnimation size={65} />
            ) : studentWorkplaces?.data &&
                studentWorkplaces?.data?.length > 0 &&
                studentWorkplaces?.isSuccess ? (
                <>
                    {/* Compact Requests List */}
                    <div className="p-3.5 max-h-[196px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="space-y-2.5">
                            {sortedWorkplaces?.map(
                                (
                                    request,
                                    index
                                ) => (
                                    <WorkplaceSmallCard
                                        index={index}
                                        key={request?.id}
                                        request={request}
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* Detailed Request View */}
                    {/* {selectedWorkplace && (
                        <WorkplaceInfoDetails
                            selectedWorkplace={selectedWorkplace}
                        />
                    )} */}
                </>
            ) : studentWorkplaces?.isSuccess ? (
                <NoData text="No placement request found!" />
            ) : null}
        </div>
    )
}
