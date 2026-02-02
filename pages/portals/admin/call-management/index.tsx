import { AdminLayout } from '@layouts'
import { Call, CallStatus, DashboardStats } from '@partials/common'
import { ReactElement, useState } from 'react'

const CallManagementPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-6 py-6">


                <DashboardStats
                // activeStatusPage={activeStatusPage}
                // onStatusPageChange={setActiveStatusPage}
                />

                {/* <FilterBar
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    totalCalls={calls.length}
                    filteredCount={filteredCalls.length}
                    activeStatusPage={activeStatusPage}
                /> */}

                {/* Call List */}
                {/* <CallList
                    calls={filteredCalls}
                    onCallSelect={setSelectedCall}
                    onMarkCompleted={handleMarkCompleted}
                    onCreateTicket={handleCreateTicket}
                /> */}

                {/* {selectedCall && (
                    <CallDetailModal
                        call={selectedCall}
                        onClose={() => setSelectedCall(null)}
                    />
                )}

                {ticketModalCall && (
                    <TicketModal
                        call={ticketModalCall}
                        onClose={() => setTicketModalCall(null)}
                        onCreateTicket={handleTicketSubmit}
                    />
                )} */}
            </div>
        </div>
    )
}

CallManagementPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default CallManagementPage
