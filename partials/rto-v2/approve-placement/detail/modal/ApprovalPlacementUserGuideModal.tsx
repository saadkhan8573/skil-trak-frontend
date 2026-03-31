'use client'

import { GlobalModal } from '@components'
import { useState } from 'react'
import { MdCancel } from 'react-icons/md'

export const ApprovalPlacementUserGuideModal = ({
    onCancel,
}: {
    onCancel: () => void
}) => {
    const [activeTab, setActiveTab] = useState('compliance')

    const progressSteps = [
        { label: 'Student\nUploaded', status: 'complete' },
        { label: 'Interview', status: 'complete' },
        { label: 'Request\nGenerated', status: 'complete' },
        { label: 'Capacity\nVerified', status: 'complete' },
        { label: 'Student\nReview', status: 'complete' },
        { label: 'RTO\nReview', status: 'current' },
        { label: 'Industry\nConfirmation', status: 'pending' },
    ]

    const quickReviewItems = [
        { label: 'Compliance', status: 'complete' },
        { label: 'Supervisors', status: 'complete' },
        { label: 'Capacity', status: 'complete' },
    ]

    const highlightedTasks = [
        'Course field is cookery versus youth work.',
        'Unit code is SITHCCC043 versus CHC50413.',
        'Duration is 48 service periods versus 160 hours.',
        'Tasks involve cooking food versus youth support activities.',
        'Requires preparing menu types versus a checklist of 112 tasks.',
        'No mention of logbook versus detailed logbook is mandatory.',
        'Supervision is by kitchen team versus Supervisor and Assessor.',
        'Assessment method is not detailed versus using logbook and interviews.',
        'Safety is general versus specific WHS and child protection units.',
        'Provider is a general unit versus a specific RTO (Open Colleges).',
        'Client focus is food customers versus young people at risk.',
    ]

    const industryDetails = [
        {
            label: '🏭 Industry Sector',
            value: 'Computer Science',
            isLink: false,
            isEmail: false,
        },
        {
            label: '📋 ABN',
            value: '02913892849',
            isLink: false,
            isEmail: false,
        },
        {
            label: '📍 Address',
            value: 'Alkimos Drive, Alkimos WA, Australia',
            isLink: false,
            isEmail: false,
        },
        {
            label: '🌐 Website',
            value: 'Visit Website ↗',
            isLink: true,
            isEmail: false,
        },
        {
            label: '👤 Contact Person Name',
            value: 'Haroon Aziz',
            isLink: false,
            isEmail: false,
        },
        {
            label: '📞 Phone',
            value: '03460476465',
            isLink: false,
            isEmail: false,
        },
        {
            label: '📧 Email',
            value: 'vyro@skiltrak.com.au',
            isLink: false,
            isEmail: true,
        },
    ]

    const placementDetails = [
        {
            label: 'Course Focus',
            value: 'Software Development & Computer Science',
        },
        { label: 'Placement Duration', value: 'As per course requirements' },
        { label: 'Student Capacity', value: 'Verified and Available' },
        { label: 'Supervision', value: 'Qualified Industry Professionals' },
    ]

    const nextSteps = [
        {
            icon: '✓',
            type: 'success',
            text: 'If approved:',
            detail: 'Proceeds to Industry Confirmation',
        },
        {
            icon: '✗',
            type: 'danger',
            text: 'If rejected:',
            detail: 'Alternative search initiated',
        },
        {
            icon: 'ℹ',
            type: 'info',
            text: "You'll receive status updates via email",
            detail: '',
        },
    ]

    const approvalReasons = [
        'All compliance checklists are signed and complete',
        'Industry has verified capacity for student placements',
        'Workplace aligns with course learning outcomes',
        'Qualified supervisors are in place',
        'Safety and resource requirements are met',
    ]

    const rejectionReasons = [
        'Incomplete compliance documentation',
        'Insufficient or unqualified supervisors',
        "Workplace doesn't align with course requirements",
        'Safety concerns or inadequate resources',
        'Capacity issues or unclear placement details',
    ]

    const tabs = [
        { id: 'compliance', icon: '🛡️', label: 'Compliance' },
        { id: 'stream-blocks', icon: '🎓', label: 'Streams' },
        { id: 'supervisors', icon: '👥', label: 'Supervisors' },
        { id: 'resources', icon: '📂', label: 'Resources' },
    ]

    const checklistItems = [
        {
            title: 'Streams and Services Offered',
            content:
                'The organization specializes in software development and related services.',
        },
        {
            title: 'Branches and Site Locations throughout Australia',
            content:
                'The verified location for this organization is Alkimos Drive, Alkimos WA, Australia.',
        },
        {
            title: 'Activities',
            content:
                'The workplace engages in software development activities relevant to the industry, providing suitable tasks for students.',
        },
        {
            title: 'Eligibility Notes / Justification Approval for Data Structures and Algorithms-CS201',
            content:
                'The organization has been contacted and verified by the Skiltrak Coordinator. The industry has signed the facility checklist. The workplace provides sufficient evidence of tasks and activities that align with the learning outcomes for Data Structures and Algorithms-CS201. Approval is granted.',
        },
        {
            title: 'Skiltrak Coordinator Note:',
            content: 'ok',
        },
    ]

    const impactCards = [
        {
            type: 'approve',
            icon: '✓',
            color: 'green',
            title: 'When You Approve',
            immediateTitle: 'Immediate Effect:',
            immediateText:
                'Student can proceed with placement. Status moves to "Industry Confirmation" stage.',
            futureTitle: 'Future Impact:',
            futureText:
                'This workplace becomes pre-approved for future students in the same course, speeding up the approval process.',
        },
        {
            type: 'reject',
            icon: '✗',
            color: 'red',
            title: 'When You Reject',
            immediateTitle: 'Immediate Effect:',
            immediateText:
                'Student must find an alternative workplace. Rejection note added to profile.',
            futureTitle: 'Future Impact:',
            futureText:
                'This workplace will not appear for any future students in your organization, protecting quality standards.',
        },
    ]

    const AlertBox = ({ type, icon, title, content }: any) => {
        const colors = {
            warning: {
                bg: 'bg-yellow-100',
                border: 'border-yellow-400',
                iconBg: 'bg-[#F7A619]',
                text: 'text-gray-700',
                titleText: 'text-gray-900',
            },
            info: {
                bg: 'bg-blue-50',
                border: 'border-blue-500',
                iconBg: 'bg-[#044866]',
                text: 'text-gray-700',
                titleText: 'text-gray-900',
            },
            success: {
                bg: 'bg-green-50',
                border: 'border-green-500',
                iconBg: 'bg-green-600',
                text: 'text-gray-700',
                titleText: 'text-gray-900',
            },
            danger: {
                bg: 'bg-red-100',
                border: 'border-red-500',
                iconBg: 'bg-red-600',
                text: 'text-gray-700',
                titleText: 'text-gray-900',
            },
        }
        const color = colors[type as keyof typeof colors]

        return (
            <div
                className={`flex gap-3 ${color.bg} border ${color.border} rounded-lg p-4`}
            >
                <div
                    className={`w-8 h-8 ${color.iconBg} rounded-full flex items-center justify-center text-white shrink-0`}
                >
                    {icon}
                </div>
                <div>
                    <h4
                        className={`text-sm font-bold mb-1.5 ${color.titleText}`}
                    >
                        {title}
                    </h4>
                    <p className={`${color.text} text-sm`}>{content}</p>
                </div>
            </div>
        )
    }

    return (
        <GlobalModal onCancel={onCancel}>
            <MdCancel
                onClick={onCancel}
                className="transition-all duration-500 text-gray-200 hover:text-white text-3xl cursor-pointer hover:rotate-90 absolute top-1.5 right-2 z-10"
            />

            <div className="bg-gray-50 rounded-xl max-h-[85vh] overflow-auto custom-scrollbar">
                {/* Hero Header */}
                <div className="bg-linear-to-br from-[#044866] to-[#0d5468] py-12 px-4 text-center text-white rounded-t-xl">
                    <h1 className="text-4xl font-extrabold mb-3">
                        RTO Approval Process Guide
                    </h1>
                    <p className="text-white opacity-95">
                        Complete walkthrough for reviewing and approving
                        workplace placements
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 pb-12">
                    {/* Progress Tracker */}
                    <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                        <h3 className="text-gray-900 mb-5 font-bold">
                            Placement Approval Journey
                        </h3>

                        <div className="relative mb-4">
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                            <div className="absolute top-4 left-0 h-0.5 bg-[#F7A619] z-1 w-[83%]" />

                            <div className="flex justify-between items-center relative z-2">
                                {progressSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex-1 text-center"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center font-bold border-2 border-white shadow-md text-xs
                                                ${
                                                    step.status === 'complete'
                                                        ? 'bg-[#F7A619] text-white'
                                                        : ''
                                                }
                                                ${
                                                    step.status === 'current'
                                                        ? 'bg-[#044866] text-white w-9 h-9 text-sm'
                                                        : ''
                                                }
                                                ${
                                                    step.status === 'pending'
                                                        ? 'bg-gray-200 text-gray-400'
                                                        : ''
                                                }`}
                                        >
                                            {step.status === 'complete'
                                                ? '✓'
                                                : step.status === 'current'
                                                  ? '6'
                                                  : '7'}
                                        </div>
                                        <div
                                            className={`text-[10px] font-medium whitespace-pre-line ${
                                                step.status === 'current'
                                                    ? 'text-[#044866] font-bold'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {step.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <AlertBox
                            type="warning"
                            icon="⚠"
                            title="Action Required"
                            content="Review all workplace information and make your approval decision below."
                        />
                    </div>

                    {/* Step 1 */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Step 1: Understanding Your Role
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            You're at stage 6: RTO Review - The final quality
                            check
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                            When a student approves a workplace request, it
                            enters <strong>"Awaiting Your Review"</strong>{' '}
                            status. Your role is to verify that this workplace
                            meets all RTO standards before the student begins
                            their placement.
                        </p>

                        <AlertBox
                            type="info"
                            icon="ℹ"
                            title="Important: Website Note"
                            content="Organization websites may not always be fully updated. Base your decision on the full evidence in this account, including compliance checklists and verified documentation, not solely on the website."
                        />
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Step 2: Check Quick Review Dashboard
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Verify all requirements at a glance
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                            The Quick Review panel shows you the completion
                            status of all critical requirements. This appears in
                            the right sidebar of the interface.
                        </p>

                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#044866] rounded-full flex items-center justify-center text-white text-sm">
                                    ⚡
                                </div>
                                <h3 className="text-[#044866] text-lg font-bold">
                                    Quick Review
                                </h3>
                            </div>
                            <p className="text-[#044866] mb-3 font-medium text-sm">
                                All requirements verified
                            </p>

                            <div className="grid gap-2">
                                {quickReviewItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-3 flex justify-between items-center border border-gray-200"
                                    >
                                        <span className="text-gray-900 font-medium text-sm">
                                            {item.label}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-semibold text-xs text-green-600">
                                            ✓ Complete
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <AlertBox
                                type="success"
                                icon="✓"
                                title=""
                                content="All indicators must show 'Complete' before you can approve. If any show 'Not Complete', the industry must update their submission first."
                            />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Step 3: Review Industry Profile
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Basic workplace information and contact details
                        </p>

                        <div className="bg-gray-100 p-5 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-[#044866] rounded-lg flex items-center justify-center text-white text-lg">
                                    🏢
                                </div>
                                <div>
                                    <h3 className="text-[#044866] text-lg font-bold">
                                        Vyro Software House Tasmania
                                    </h3>
                                    <p className="text-gray-500 mt-0.5 text-xs">
                                        Workplace type: Software Plus Medical
                                        Plus Computer
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-5 mt-4 border border-gray-200">
                                <h4 className="text-gray-900 font-bold mb-4 text-sm">
                                    Industry Approval Checklist
                                </h4>

                                {checklistItems.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="text-gray-700 leading-relaxed mb-2 text-sm">
                                            <strong>{item.title}</strong>
                                        </p>
                                        <p className="text-gray-500 leading-relaxed text-xs">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                                {industryDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-0.5"
                                    >
                                        <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">
                                            {detail.label}
                                        </span>
                                        <span className="text-gray-900 text-xs font-medium">
                                            {detail.isLink ? (
                                                <a
                                                    href="#"
                                                    className="text-[#044866] hover:underline"
                                                >
                                                    {detail.value}
                                                </a>
                                            ) : detail.isEmail ? (
                                                <a
                                                    href={`mailto:${detail.value}`}
                                                    className="text-[#044866] hover:underline"
                                                >
                                                    {detail.value}
                                                </a>
                                            ) : (
                                                detail.value
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Step 4: Review Detailed Information
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Compliance, Streams, Supervisors, and Resources
                        </p>

                        {/* Tabs */}
                        <div className="flex gap-1.5 mb-6 border-b-2 border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-3 bg-transparent border-none font-semibold cursor-pointer border-b-2 transition-all flex items-center gap-1.5 text-sm
                                            ${
                                                activeTab === tab.id
                                                    ? 'text-[#044866] border-b-[#044866]'
                                                    : 'text-gray-500 border-b-transparent hover:text-[#044866]'
                                            }`}
                                >
                                    <span>{tab.icon}</span> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Compliance Tab */}
                        {activeTab === 'compliance' && (
                            <>
                                <div className="bg-linear-to-br from-green-100 to-green-50 rounded-lg p-5 border border-green-500">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">
                                            ✓
                                        </div>
                                        <h4 className="text-green-900 font-bold">
                                            All Compliance Verified
                                        </h4>
                                    </div>
                                    <p className="text-green-800 leading-relaxed text-sm">
                                        This workplace has completed and signed
                                        all required checklists. Documentation
                                        is based on training.gov.au requirements
                                        and Reviewed with our compliance
                                        partners.
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-5 mt-5 border border-blue-500">
                                    <h4 className="text-[#044866] font-bold mb-3 flex items-center gap-1.5">
                                        📋 Highlighted Tasks
                                    </h4>
                                    <p className="text-blue-900 mb-3 text-xs">
                                        Course-specific requirements derived
                                        from RTO standards:
                                    </p>
                                    {highlightedTasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 py-1.5 text-blue-900 text-xs"
                                        >
                                            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-[10px] shrink-0 mt-0.5">
                                                ✓
                                            </div>
                                            <span>{task}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Checklists */}
                                <div className="bg-white rounded-lg p-5 mt-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#044866] rounded-lg flex items-center justify-center text-white text-sm">
                                                📋
                                            </div>
                                            <h4 className="text-gray-900 font-bold">
                                                Skiltrak Facility Checklist
                                            </h4>
                                        </div>
                                        <div className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-yellow-100 text-yellow-900">
                                            <span>✓</span> SIGNED & COMPLETE
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3 mt-3">
                                        <p className="text-gray-500 text-xs mb-0.5">
                                            <strong>Signed By</strong>
                                        </p>
                                        <strong className="text-[#044866] text-xs">
                                            Vyro Software House Tasmania
                                        </strong>
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-3 mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📄</span>
                                            <div>
                                                <p className="text-gray-900 font-semibold mb-0.5 text-xs">
                                                    https://skiltrak-dev.s3.ap-southeas...
                                                </p>
                                                <p className="text-gray-500 text-[10px]">
                                                    <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                                                        PDF
                                                    </span>{' '}
                                                    Available for review
                                                </p>
                                            </div>
                                        </div>
                                        <button className="bg-white border-2 border-[#044866] text-[#044866] px-5 py-1.5 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[#044866] hover:text-white text-xs">
                                            VIEW
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-5 mt-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                                                📋
                                            </div>
                                            <h4 className="text-gray-900 font-bold">
                                                RTO Facility Checklist
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="text-center py-8 text-gray-400 italic text-sm">
                                        No RTO Facility Checklist found
                                    </div>
                                    <AlertBox
                                        type="info"
                                        icon="ℹ"
                                        title=""
                                        content="You can initiate an RTO facility checklist if required, or it will auto-populate if a previous student with the same course has one already signed."
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Step 5 */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Step 5: Make Your Decision
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Approve or reject this workplace placement
                        </p>

                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-[#F7A619]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-[#F7A619] rounded-full flex items-center justify-center text-white">
                                    ⚖
                                </div>
                                <div>
                                    <h3 className="text-yellow-900 text-lg font-bold">
                                        Make Your Decision
                                    </h3>
                                    <div className="text-yellow-800 text-xs font-medium">
                                        Review complete - ready for approval
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 my-4">
                                <p className="text-gray-700 leading-relaxed mb-5 text-sm">
                                    All verification checks are complete. Review
                                    the workplace information and make your
                                    decision below.
                                </p>

                                <div className="grid gap-3">
                                    <button className="py-3 px-6 border-none rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all bg-green-600 text-white hover:bg-green-700">
                                        <span className="text-base">✓</span>{' '}
                                        APPROVE WORKPLACE
                                    </button>
                                    <button className="py-3 px-6 border-2 rounded-lg text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                                        <span className="text-base">✗</span>{' '}
                                        REJECT WORKPLACE
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-5 mt-5 border border-blue-500">
                            <h4 className="text-[#044866] font-bold mb-3 flex items-center gap-1.5">
                                ℹ️ What happens next?
                            </h4>
                            {nextSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2 py-1.5"
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs
                                            ${
                                                step.type === 'success'
                                                    ? 'bg-green-100 text-green-600'
                                                    : ''
                                            }
                                            ${
                                                step.type === 'danger'
                                                    ? 'bg-red-100 text-red-600'
                                                    : ''
                                            }
                                            ${
                                                step.type === 'info'
                                                    ? 'bg-blue-100 text-[#044866]'
                                                    : ''
                                            }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <div className="text-blue-900 leading-relaxed text-xs">
                                        {step.detail ? (
                                            <>
                                                <strong className="text-[#044866] font-bold">
                                                    {step.text}
                                                </strong>{' '}
                                                {step.detail}
                                            </>
                                        ) : (
                                            step.text
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5">
                            <AlertBox
                                type="danger"
                                icon="⚠"
                                title="Important: Rejection Impact"
                                content="If rejected, this workplace will not appear in future for any of your students."
                            />
                        </div>
                    </div>

                    {/* Programs Overview */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-1.5 font-extrabold">
                            Streams & Services Overview
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            What this workplace offers
                        </p>

                        <div className="bg-blue-50 rounded-lg p-5 border border-blue-500">
                            <h4 className="text-[#044866] font-bold mb-3 text-sm">
                                Placement Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {placementDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-0.5"
                                    >
                                        <span className="text-gray-500 text-[10px] uppercase tracking-wide font-semibold">
                                            {detail.label}
                                        </span>
                                        <span className="text-gray-900 text-xs font-medium">
                                            {detail.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Decision Points */}
                    {/* Key Decision Points */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-2 font-extrabold">
                            Key Decision Points
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Critical factors to consider before making your
                            decision
                        </p>

                        <div className="grid gap-4 mt-5">
                            <div className="bg-linear-to-br from-green-100 to-green-50 border-l-3 border-green-600 rounded-lg p-5">
                                <h4 className="text-green-900 font-bold mb-2 flex items-center gap-2">
                                    <span className="text-lg">✅</span> Reasons
                                    to Approve
                                </h4>
                                <ul className="text-green-800 leading-6 ml-4 list-disc">
                                    {approvalReasons.map((reason, index) => (
                                        <li key={index}>{reason}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-linear-to-br from-red-100 to-red-50 border-l-3 border-red-600 rounded-lg p-5">
                                <h4 className="text-red-900 font-bold mb-2 flex items-center gap-2">
                                    <span className="text-lg">❌</span> Reasons
                                    to Reject
                                </h4>
                                <ul className="text-red-800 leading-6 ml-4 list-disc">
                                    {rejectionReasons.map((reason, index) => (
                                        <li key={index}>{reason}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Understanding the Impact */}
                    <div className="bg-white rounded-xl p-8 shadow-md mb-6">
                        <h2 className="text-2xl text-gray-900 mb-2 font-extrabold">
                            Understanding the Impact
                        </h2>
                        <p className="text-gray-500 mb-6">
                            How your decision affects future placements
                        </p>

                        <div className="grid md:grid-cols-2 gap-5 mt-5">
                            {impactCards?.map((card) => (
                                <div className="bg-white rounded-lg p-6 border-2 border-green-600">
                                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                                        {card?.icon}
                                    </div>
                                    <h4 className="text-green-900 font-bold text-lg mb-3">
                                        {card?.title}
                                    </h4>
                                    <p className="text-green-800 leading-relaxed mb-3">
                                        <strong>{card?.immediateTitle}</strong>
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        {card?.immediateText}
                                    </p>
                                    <p className="text-green-800 leading-relaxed mb-3">
                                        <strong>{card?.futureTitle}</strong>
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        {card?.futureText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-linear-to-br from-[#044866] to-[#0d5468] text-white p-8 text-center rounded-xl mt-8">
                        <h3 className="text-xl mb-3">
                            Skiltrak RTO Approval System
                        </h3>
                        <p className="opacity-90 mb-2">
                            Streamlining workplace placement approvals
                        </p>
                        <p className="opacity-70 text-xs">
                            © 2025 Skiltrak. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}
