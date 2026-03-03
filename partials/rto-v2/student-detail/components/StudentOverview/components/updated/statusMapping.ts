export const STATUS_CONTENT: Record<
    string,
    { title: string; description: string }
> = {
    'Waiting for Student': {
        title: 'Awaiting Student Approval',
        description:
            'The industry has responded to your placement request. Please review the details and approve the request to proceed further.',
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
            'Your placement request has been approved. Please schedule your appointment with the industry to move forward.',
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
            'Your workplace placement has officially started. Please ensure you follow your approved schedule and requirements.',
    },
    'Schedule Completed': {
        title: 'Schedule Completed',
        description:
            'Your placement schedule has been successfully completed. Please ensure all required documentation and logs are submitted.',
    },
    Cancelled: {
        title: 'Placement Cancelled',
        description:
            'This workplace request has been marked as cancelled. Please contact your RTO for further assistance if needed.',
    },
    Terminated: {
        title: 'Placement Terminated',
        description:
            'The industry has terminated the placement. Please contact your RTO immediately for further guidance.',
    },
    'No Response': {
        title: 'No Response from Industry',
        description:
            'The industry has not responded to your placement request yet. You may wait or contact your RTO for support.',
    },
    'Industry Eligibility Check': {
        title: 'Industry Eligibility Check',
        description:
            'The industry is currently undergoing an eligibility check to host placements.',
    },
}
