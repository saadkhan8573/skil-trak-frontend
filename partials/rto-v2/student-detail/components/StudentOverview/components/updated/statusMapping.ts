export const STATUS_CONTENT: Record<
    string,
    { title: string; description: string }
> = {
    // ── Shared ────────────────────────────────────────────────────────────────
    'Student Added': {
        title: 'Student Added',
        description:
            'The student has been added to the system and a workplace placement request is pending.',
    },
    'Waiting for Industry': {
        title: 'Awaiting Industry Confirmation',
        description:
            'The workplace will review your placement request shortly.',
    },
    'Placement Started': {
        title: 'Placement in Progress',
        description:
            'The placement of the student has officially started. Please ensure the student follows the approved placement schedule and requirements.',
    },
    Completed: {
        title: 'Placement Completed',
        description:
            'The placement has been successfully completed. Please ensure all required documentation and logs are submitted.',
    },

    // ── Need Workplace ────────────────────────────────────────────────────────
    'Industry Sourcing': {
        title: 'Sourcing Industry Partner',
        description:
            'A case officer has been assigned and is actively working to source a suitable industry partner for the student.',
    },
    'Waiting for Student': {
        title: 'Awaiting Student Approval',
        description:
            'The workplace option has been sent to the student. The student will review the details and approve the request to proceed further.',
    },
    'Waiting for RTO': {
        title: 'Awaiting RTO Confirmation',
        description:
            'The student has approved the industry. The RTO will now review and confirm the placement shortly.',
    },
    Appointment: {
        title: 'Book Your Appointment',
        description:
            'The placement request has been approved. The student needs to schedule their appointment with the industry to move forward.',
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

    // ── Provided Workplace ────────────────────────────────────────────────────
    'Provided Workplace Request': {
        title: 'Workplace Request Submitted',
        description:
            'The student has submitted their own workplace for approval. The RTO is currently reviewing the request.',
    },
    'Industry Eligibility Pending': {
        title: 'Industry Eligibility Check',
        description:
            'The nominated industry is being checked for eligibility to host student placements.',
    },
    'Agreement and Eligibility Pending': {
        title: 'Agreement & Eligibility Pending',
        description:
            'The placement agreement has been sent to all parties. Awaiting all required signatures and eligibility confirmation.',
    },
    'Agreement and Eligibility Signed': {
        title: 'Agreement & Eligibility Confirmed',
        description:
            'All parties have signed the agreement. The student can now begin their placement.',
    },

    // ── Terminal States ───────────────────────────────────────────────────────
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
}
