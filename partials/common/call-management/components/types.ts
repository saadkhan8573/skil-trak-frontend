export type CallReason =
    | 'Workplace Details Collection'
    | 'Document Verification'
    | 'Workplace Request Assistance'
    | 'Incomplete Information Follow-up'
    | 'App Navigation Support'
    | 'Scheduled Call Back'
    | 'Initial Contact Attempt'
    | 'Number Validation'

export type AgentAction =
    | 'Collect Workplace Information'
    | 'Request Missing Documents'
    | 'Create Workplace Request'
    | 'Provide App Guidance'
    | 'Schedule Follow-up Call'
    | 'Leave Voicemail'
    | 'Update Contact Information'

export const CALL_REASON_ACTIONS: Record<CallReason, AgentAction[]> = {
    'Workplace Details Collection': [
        'Collect Workplace Information',
        'Request Missing Documents',
        'Update Contact Information',
    ],
    'Document Verification': [
        'Request Missing Documents',
        'Schedule Follow-up Call',
        'Update Contact Information',
    ],
    'Workplace Request Assistance': [
        'Create Workplace Request',
        'Collect Workplace Information',
        'Provide App Guidance',
    ],
    'Incomplete Information Follow-up': [
        'Collect Workplace Information',
        'Request Missing Documents',
        'Schedule Follow-up Call',
        'Update Contact Information',
    ],
    'App Navigation Support': [
        'Provide App Guidance',
        'Schedule Follow-up Call',
    ],
    'Scheduled Call Back': [
        'Schedule Follow-up Call',
        'Update Contact Information',
        'Collect Workplace Information',
    ],
    'Initial Contact Attempt': [
        'Leave Voicemail',
        'Schedule Follow-up Call',
        'Update Contact Information',
    ],
    'Number Validation': [
        'Update Contact Information',
        'Leave Voicemail',
        'Schedule Follow-up Call',
    ],
}

export const AVAILABLE_ACTIONS: AgentAction[] = [
    'Collect Workplace Information',
    'Request Missing Documents',
    'Create Workplace Request',
    'Provide App Guidance',
    'Schedule Follow-up Call',
    'Leave Voicemail',
    'Update Contact Information',
]
