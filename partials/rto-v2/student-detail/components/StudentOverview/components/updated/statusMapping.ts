export const STATUS_CONTENT: Record<
    string,
    { title: string; description: string }
> = {
    'Waiting for Student': {
        title: 'Awaiting Student Approval',
        description:
            'The Workplace option has been sent to the student. Student will review the details and approve the request to proceed further.',
    },
    'Waiting for RTO': {
        title: 'Awaiting RTO Confirmation',
        description:
            'The student has approved the industry. The RTO will now review and confirm the placement shortly.',
    },
    'Waiting for Industry': {
        title: 'Awaiting Industry Confirmation',
        description:
            'The workplace will review your placement request shortly.',
    },
    Appointment: {
        title: 'Book Your Appointment',
        description:
            'Student placement request has been approved. Student need to schedule their appointment with the industry to move forward.',
    },
    'Agreement Pending': {
        title: 'Agreement & Eligibility Pending',
        description:
            'The placement agreement has been sent to all parties. We are currently waiting for all required signatures and eligibility confirmation.',
    },
    'Agreement Signed': {
        title: 'Agreement & Eligibility Confirmed',
        description:
            'All parties have signed the agreement. Please proceed to add your placement schedule to continue.',
    },
    'Placement Started': {
        title: 'Placement in Progress',
        description:
            'The placement of the student has officially started. Please ensure that student follow the approved placement schedule and requirements.',
    },
    'Schedule Completed': {
        title: 'Schedule Completed',
        description:
            'The placement schedule has been successfully completed. Please ensure all required documentation and logs are submitted.',
    },
    Cancelled: {
        title: 'Placement Cancelled',
        description:
            'This workplace request has been marked as cancelled. Please contact your RTO for further assistance if needed.',
    },
    Terminated: {
        title: 'Placement Terminated',
        description:
            'The industry has terminated the placement. Please contact your Industry immediately for further guidance.',
    },
    'No Response': {
        title: 'No Response from Industry',
        description:
            'The industry has not responded to your placement request yet. You may wait or contact your Industry for support.',
    },
    'Industry Eligibility Check': {
        title: 'Industry Eligibility Check',
        description:
            'The industry is currently undergoing an eligibility check to host placements.',
    },
}
