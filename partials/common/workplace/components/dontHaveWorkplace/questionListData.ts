import { workplaceQuestionsKeys } from '../../enum'

export const workplaceQuestions = {
    [workplaceQuestionsKeys.suburb]:
        'Please provide the full address where you would prefer to work. This should be based on your current address.',
    [workplaceQuestionsKeys.supervisorMeeting]:
        'When would you be available to meet with workplace supervisors once a placement becomes available? Please provide two timing options',
    [workplaceQuestionsKeys.commutePlan]:
        'How do you plan to commute to the workplace',
    [workplaceQuestionsKeys.placementStartDate]:
        'When would you like to commence your placement? options',
    [workplaceQuestionsKeys.possession]:
        'Do you possess any of the following documents? Please ignore those that do not apply to you:',
    [workplaceQuestionsKeys.currentEmploymentStatus]:
        'Are you currently employed? Would you mind providing the details?',
    [workplaceQuestionsKeys.relaventExperience]:
        'Do you have any relevant experience in the field for which you are seeking placement?',
    [workplaceQuestionsKeys.placementGoals]:
        'What are your desired outcomes upon successfully completing the placement? Options include securing',
    [workplaceQuestionsKeys.medicalCondition]:
        'Do you have any medical conditions that may affect your ability to work?',
    [workplaceQuestionsKeys.placementPreferences]:
        'Is there any specific aspect you are seeking in a placement opportunity?',
    [workplaceQuestionsKeys.awarenessOfUnpaidPlacement]:
        'Are you aware that the placement is unpaid and forms a part of your studies?',
    [workplaceQuestionsKeys.understandingOfDocumentation]:
        'Do you understand the documentation and assessments required for the placement, such as the Agreement and workbook etc?',
    [workplaceQuestionsKeys.preferredContactTime]:
        'When would be the most convenient time for one of the SkilTrak coordinators to call you to discuss workplace details further*',
    [workplaceQuestionsKeys.autoTalentPool]:
        'Would you like to be added to our Talent Pool Programme? Once you successfully complete your placement, you will be added to this list. Industries can view your profile and contact you directly for interviews.',
    [workplaceQuestionsKeys.serviceOffered]:
        'Industry can only confirm placements that include the requested meal period(s) or provide an override reason?',
}

export const questionList = [
    {
        name: workplaceQuestionsKeys.suburb,
        index: 1,
        title: 'Preferred Work Location: Address',
        required: true,
        type: 'text',
        inputValues: [
            {
                name: 'suburb',
                label: 'Address',
                type: 'text',
                placeholder:
                    'Where would you want to locate your self? (Address)',
            },
            {
                name: 'zip',
                label: 'Post Code',
                type: 'text',
                placeholder: 'Post Code',
            },
        ],
        fullWidth: true,
    },
    {
        name: workplaceQuestionsKeys.medicalCondition,
        index: 2,
        title: 'Medical Conditions:',
        required: true,
    },
    {
        name: workplaceQuestionsKeys.commutePlan,
        index: 3,
        title: 'Commute Plan:',
        customAnswers: ['My Own', 'Public transportation'],
        required: true,
    },
    {
        name: workplaceQuestionsKeys.awarenessOfUnpaidPlacement,
        index: 4,
        title: 'Awareness of Unpaid Placement:',
        required: true,
        onlyAccept: true,
    },
    {
        name: workplaceQuestionsKeys.understandingOfDocumentation,
        index: 5,
        title: 'Understanding of Documentation:',
        required: true,
        onlyAccept: true,
    },
    {
        name: workplaceQuestionsKeys.preferredContactTime,
        index: 11,
        title: 'Preferred Contact Time',
        required: true,
        type: 'textarea',
    },
    {
        name: workplaceQuestionsKeys.autoTalentPool,
        index: 7,
        title: 'Auto Talent Pool:',
        required: false,
    },
    {
        name: workplaceQuestionsKeys.serviceOffered,
        index: 6,
        title: 'Selecting Hospitality reveals the meal-period question and enforces at least one choice:',
        required: true,
        multipleSelection: true,
        customAnswers: ['breakfast', 'lunch', 'dinner'],
    },
    // {
    //     name: workplaceQuestionsKeys.supervisorMeeting,
    //     index: 8,
    //     type: 'days',
    //     title: 'Availability for Supervisor Meeting:',
    //     fullWidth: true,
    //     inputValues: [
    //         {
    //             name: 'supervisorMeetingDate1',
    //             type: 'date',
    //             label: 'Option 1',
    //             placeholder:
    //                 'Where would you want to locate your self? (Suburb)',
    //         },
    //         {
    //             name: 'supervisorMeetingDate2',
    //             type: 'date',
    //             label: 'Option 2',
    //             placeholder:
    //                 'Where would you want to locate your self? (Suburb)',
    //         },
    //     ],
    // },
    // {
    //     name: workplaceQuestionsKeys.placementStartDate,
    //     index: 9,
    //     title: 'Placement Start Date:',
    //     required: true,
    //     type: 'text',
    //     inputKey: 'Estimated Date',
    //     inputValues: [
    //         {
    //             name: 'placementStartDate',
    //             type: 'date',
    //             label: 'Estimated Date',
    //             placeholder:
    //                 'Where would you want to locate your self? (Suburb)',
    //         },
    //     ],
    // },
    {
        name: workplaceQuestionsKeys.placementPreferences,
        index: 10,
        title: 'Specific Placement Preferences:',
        required: false,
        type: 'textarea',
    },

    // {
    //     name: workplaceQuestionsKeys.possession,
    //     index: 12,
    //     title: 'Possession of Documents:',
    //     required: true,
    //     multipleSelection: true,
    //     fullWidth: true,
    //     customAnswers: [
    //         'CV',
    //         'Cover letter',
    //         'Police check',
    //         'COVID-19 vaccine certificate',
    //         'working with children check',
    //         'NDIS screening check',
    //         'First aid certification',
    //         'driving license',
    //         'White Card (Construction Induction Card)',
    //     ],
    // },
    // {
    //     name: workplaceQuestionsKeys.currentEmploymentStatus,
    //     index: 13,
    //     title: 'Current Employment Status:',
    //     required: true,
    // },
    // {
    //     name: workplaceQuestionsKeys.relaventExperience,
    //     index: 14,
    //     title: 'Relevant Experience:',
    //     required: false,
    // },
    // {
    //     name: workplaceQuestionsKeys.placementGoals,
    //     index: 15,
    //     title: 'Placement Goals:',
    //     customAnswers: [
    //         'a job',
    //         'completing your course',
    //         'gaining experience',
    //         'Others',
    //     ],
    //     required: true,
    // },
]
