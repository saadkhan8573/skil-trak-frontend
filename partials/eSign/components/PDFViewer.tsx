import { useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Maximize2,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface PDFViewerProps {
    documentTitle: string
    documentType: string
    documentId: string
    description: string
}

export function PDFViewer({
    documentTitle,
    documentType,
    documentId,
    description,
}: PDFViewerProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [zoom, setZoom] = useState(100)
    const totalPages = 8

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70))

    const getPageContent = (pageNum: number) => {
        switch (pageNum) {
            case 1:
                return (
                    <>
                        <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                Official Document
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {documentTitle}
                            </h1>
                            <div className="text-lg text-gray-600 mb-4">
                                {documentType}
                            </div>
                            <div className="text-sm text-gray-500">
                                Document ID: {documentId}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                Issue Date: February 26, 2026
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Agreement Overview
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                {description}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                This Training Agreement ("Agreement") is entered
                                into as of the date of execution by and between
                                the Student, Industry Partner, and Registered
                                Training Organisation (RTO) as identified in
                                this document. The purpose of this Agreement is
                                to establish the terms and conditions under
                                which vocational education and training will be
                                provided.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Parties to this Agreement
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        THE STUDENT
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        The individual undertaking the training
                                        program
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        THE INDUSTRY PARTNER
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        The organization providing
                                        workplace-based training and supervision
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        THE RTO
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        The registered training organization
                                        delivering and assessing the
                                        qualification
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 2:
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                1. Student Responsibilities
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                The Student agrees to undertake the training
                                program in good faith and commits to the
                                following:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        1.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Attend all scheduled training sessions,
                                        both on-campus and workplace-based,
                                        unless unable to do so due to illness or
                                        other reasonable cause. Absences must be
                                        reported promptly to both the Industry
                                        Partner and RTO.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        1.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Complete all required coursework,
                                        assessments, and practical tasks within
                                        the specified timeframes. Extensions may
                                        be granted at the discretion of the RTO
                                        with appropriate evidence.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        1.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Maintain professional conduct at all
                                        times when representing the RTO and
                                        Industry Partner, including adherence to
                                        workplace health and safety policies and
                                        procedures.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        1.4
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Participate actively in all learning
                                        activities and seek clarification or
                                        assistance when needed from trainers,
                                        assessors, or workplace supervisors.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        1.5
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Notify the RTO and Industry Partner of
                                        any changes to personal circumstances
                                        that may affect training participation,
                                        including changes of address, contact
                                        details, or employment status.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                2. Industry Partner Responsibilities
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                The Industry Partner agrees to support the
                                Student's learning and development by:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Providing appropriate workplace
                                        supervision by a qualified and
                                        experienced supervisor who will guide
                                        the Student's practical learning and
                                        skill development.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Ensuring the Student has access to
                                        necessary tools, equipment, and
                                        resources to complete workplace-based
                                        training tasks and assessments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 3:
                return (
                    <>
                        <div className="mb-6">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Allowing the Student sufficient time
                                        during work hours to complete required
                                        training activities, attend classes, and
                                        prepare for assessments as outlined in
                                        the training plan.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.4
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Maintaining regular communication with
                                        the RTO regarding the Student's
                                        progress, attendance, and any concerns
                                        that may arise during the training
                                        period.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.5
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Complying with all workplace health and
                                        safety legislation and providing a safe
                                        working environment for the Student
                                        throughout the duration of the training
                                        program.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        2.6
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Cooperating with RTO staff during
                                        workplace visits and providing access to
                                        observe the Student's practical skills
                                        and workplace integration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                3. RTO Responsibilities
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                The RTO commits to delivering quality training
                                and assessment services by:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Delivering training and assessment in
                                        accordance with the requirements of the
                                        relevant Training Package and
                                        maintaining compliance with national VET
                                        quality standards.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Employing qualified trainers and
                                        assessors who hold the necessary
                                        qualifications, industry experience, and
                                        current industry skills relevant to the
                                        training being delivered.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Providing clear information to both
                                        Student and Industry Partner regarding
                                        course structure, assessment
                                        requirements, and expected timeframes
                                        for completion.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.4
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Conducting regular progress reviews with
                                        the Student and Industry Partner to
                                        monitor achievement and address any
                                        issues or concerns that may arise.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 4:
                return (
                    <>
                        <div className="mb-6">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.5
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Providing support services to assist the
                                        Student in successfully completing the
                                        training program, including language,
                                        literacy and numeracy support where
                                        required.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        3.6
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Issuing appropriate certification upon
                                        successful completion of the
                                        qualification, in accordance with AQF
                                        requirements and within legislated
                                        timeframes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                4. Training Program Details
                            </h2>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="py-2 font-bold text-gray-900 w-1/3">
                                                Qualification:
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                Certificate III in
                                                [Qualification Name]
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-bold text-gray-900">
                                                National Code:
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                [Code Number]
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-bold text-gray-900">
                                                Expected Duration:
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                12-24 months
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-bold text-gray-900">
                                                Commencement Date:
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                To be determined
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-bold text-gray-900">
                                                Training Location:
                                            </td>
                                            <td className="py-2 text-gray-700">
                                                RTO Campus and Industry Partner
                                                Workplace
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                The training program consists of both
                                theoretical and practical components. Theory
                                will be delivered at the RTO campus through a
                                combination of classroom sessions and online
                                learning. Practical skills development will
                                occur primarily in the workplace under Industry
                                Partner supervision.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                5. Assessment and Competency
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                Assessment will be conducted in accordance with
                                the principles of assessment and rules of
                                evidence as defined in the Standards for RTOs
                                2015. All parties acknowledge that:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        5.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Competency is not time-based and the
                                        Student may progress at their own pace,
                                        provided all assessment requirements are
                                        met to the required standard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 5:
                return (
                    <>
                        <div className="mb-6">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        5.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Assessment decisions will be made by
                                        qualified assessors based on evidence of
                                        the Student's performance against the
                                        specified criteria and standards.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        5.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Student has the right to appeal
                                        assessment decisions through the RTO's
                                        formal complaints and appeals process,
                                        details of which are provided in the
                                        Student Handbook.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        5.4
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Recognition of Prior Learning (RPL) and
                                        Credit Transfer may be available for
                                        units where the Student can demonstrate
                                        existing competency or has completed
                                        equivalent training.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                6. Workplace Health and Safety
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                All parties acknowledge the importance of
                                maintaining a safe training and working
                                environment:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        6.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Student must comply with all
                                        workplace health and safety policies,
                                        procedures, and regulations applicable
                                        to the training environment and Industry
                                        Partner workplace.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        6.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Industry Partner must ensure
                                        appropriate WHS induction is provided
                                        before the Student commences workplace
                                        activities and that ongoing safety
                                        supervision is maintained.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        6.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Any workplace incidents, injuries, or
                                        hazards must be reported immediately to
                                        both the workplace supervisor and RTO
                                        coordinator.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                7. Privacy and Confidentiality
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                All parties agree to protect the privacy and
                                confidentiality of personal information:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        7.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The RTO will collect, store, and use
                                        personal information in accordance with
                                        the Privacy Act 1988 and will only
                                        disclose information as required by law
                                        or with the Student's consent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 6:
                return (
                    <>
                        <div className="mb-6">
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        7.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Student's personal and assessment
                                        information may be shared between the
                                        RTO and Industry Partner for the
                                        purposes of training delivery and
                                        progress monitoring.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        7.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Industry Partner agrees to maintain
                                        confidentiality of student records and
                                        not to disclose information to third
                                        parties without appropriate
                                        authorization.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                8. Changes and Termination
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        8.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Any party may request changes to this
                                        Agreement by providing written notice to
                                        all other parties. Changes will only
                                        take effect when agreed to in writing by
                                        all parties.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        8.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Student may withdraw from the
                                        training program at any time by
                                        providing written notice to both the RTO
                                        and Industry Partner. Financial
                                        implications of withdrawal are outlined
                                        in the RTO's refund policy.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        8.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The Industry Partner may terminate the
                                        workplace training component by
                                        providing reasonable notice to the
                                        Student and RTO. Where possible,
                                        alternative workplace arrangements will
                                        be sought.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        8.4
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The RTO reserves the right to cancel or
                                        defer the training program due to
                                        insufficient enrolments or other
                                        circumstances beyond its control. In
                                        such cases, enrolled students will be
                                        offered alternative arrangements or a
                                        full refund.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                9. Dispute Resolution
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                                In the event of any dispute arising from this
                                Agreement:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        9.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        The parties will first attempt to
                                        resolve the matter through direct
                                        negotiation and communication in good
                                        faith.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        9.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        If direct negotiation fails, the matter
                                        may be referred to the RTO's formal
                                        complaints and appeals process for
                                        independent review and resolution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 7:
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                10. General Provisions
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        10.1
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        This Agreement constitutes the entire
                                        understanding between the parties and
                                        supersedes any prior agreements or
                                        arrangements relating to the subject
                                        matter.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        10.2
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        This Agreement is governed by the laws
                                        of [State/Territory] and the parties
                                        submit to the jurisdiction of the courts
                                        of that jurisdiction.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-bold text-gray-900 min-w-[2rem]">
                                        10.3
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        If any provision of this Agreement is
                                        found to be invalid or unenforceable,
                                        the remaining provisions will continue
                                        in full force and effect.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded p-4">
                            <h3 className="font-bold text-blue-900 mb-3">
                                Important Information for All Parties
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                                <li>
                                    Please read this entire document carefully
                                    before signing
                                </li>
                                <li>
                                    Ensure you understand all terms and
                                    conditions outlined in this Agreement
                                </li>
                                <li>
                                    Keep a copy of the signed Agreement for your
                                    records
                                </li>
                                <li>
                                    Contact the RTO if you have any questions or
                                    require clarification
                                </li>
                                <li>
                                    All parties must sign for this Agreement to
                                    be valid and enforceable
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Additional Notes
                            </h2>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200 min-h-[120px]">
                                <p className="text-sm text-gray-500 italic">
                                    Space for additional notes or special
                                    conditions (if any)
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-amber-50 border border-amber-300 rounded">
                            <p className="text-sm text-amber-800">
                                <strong>
                                    By signing this document, all parties
                                    acknowledge that they have read, understood,
                                    and agree to be bound by all terms and
                                    conditions set out in this Training
                                    Agreement.
                                </strong>
                            </p>
                        </div>
                    </>
                )

            case 8:
                return (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                SIGNATURE PAGE
                            </h2>
                            <p className="text-sm text-gray-700 text-center mb-8">
                                All parties must sign below to indicate
                                acceptance of the terms and conditions
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Student Signature Block */}
                            <div className="border-2 border-gray-300 rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                                    STUDENT SIGNATURE
                                </h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Full Name
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Signature
                                        </label>
                                        <div className="h-12 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Date
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Industry Partner Signature Block */}
                            <div className="border-2 border-gray-300 rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                                    INDUSTRY PARTNER SIGNATURE
                                </h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Organization Name
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Authorized Representative Name
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Position/Title
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Signature
                                        </label>
                                        <div className="h-12 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Date
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                </div>
                            </div>

                            {/* RTO Signature Block */}
                            <div className="border-2 border-gray-300 rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                                    RTO SIGNATURE
                                </h3>
                                <div className="space-y-4">
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            RTO Name
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Authorized Officer Name
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Position/Title
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Signature
                                        </label>
                                        <div className="h-12 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Date
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                    <div className="border-b border-gray-300 pb-2">
                                        <label className="text-xs text-gray-600 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <div className="h-8 mt-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-gray-500">
                            <p>End of Document</p>
                            <p className="mt-2">
                                Document ID: {documentId} | Generated: February
                                26, 2026
                            </p>
                        </div>
                    </>
                )

            default:
                return null
        }
    }

    return (
        <div
            className="bg-white rounded-2xl shadow-lg border overflow-hidden"
            style={{ borderColor: '#E2E8F0' }}
        >
            {/* PDF Viewer Header */}
            <div
                className="border-b px-6 py-4"
                style={{
                    borderColor: '#E2E8F0',
                    background: 'linear-gradient(to right, #F8FAFC, white)',
                }}
            >
                <div className="flex items-center justify-between">
                    <h2
                        className="text-lg font-bold flex items-center gap-2"
                        style={{ color: '#0F172A' }}
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#00A651' }}
                        ></span>
                        Document Preview
                    </h2>
                    <div className="flex items-center gap-3">
                        {/* Zoom Controls */}
                        <div
                            className="flex items-center gap-1 border-2 rounded-xl px-2 py-1.5 shadow-sm"
                            style={{ borderColor: '#E2E8F0' }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleZoomOut}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Zoom out"
                            >
                                <ZoomOut
                                    className="w-4 h-4"
                                    style={{ color: '#0066CC' }}
                                />
                            </motion.button>
                            <span
                                className="text-sm font-semibold min-w-[3.5rem] text-center"
                                style={{ color: '#0F172A' }}
                            >
                                {zoom}%
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleZoomIn}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Zoom in"
                            >
                                <ZoomIn
                                    className="w-4 h-4"
                                    style={{ color: '#0066CC' }}
                                />
                            </motion.button>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg border-2 shadow-sm"
                            style={{ borderColor: '#E2E8F0' }}
                            title="Fullscreen"
                        >
                            <Maximize2
                                className="w-4 h-4"
                                style={{ color: '#0066CC' }}
                            />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* PDF Content */}
            <div
                className="p-6 overflow-y-auto"
                style={{ maxHeight: '70vh', background: '#F8FAFC' }}
            >
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow-2xl mx-auto p-12 mb-6 rounded-lg"
                    style={{
                        width: `${zoom}%`,
                        minHeight: '842px',
                        transform: 'translateZ(0)',
                        border: '1px solid #E2E8F0',
                    }}
                >
                    {getPageContent(currentPage)}
                </motion.div>
            </div>

            {/* PDF Navigation Footer */}
            <div
                className="border-t px-6 py-4"
                style={{
                    borderColor: '#E2E8F0',
                    background: 'linear-gradient(to right, white, #F8FAFC)',
                }}
            >
                <div className="flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border-2 rounded-xl hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        style={{
                            borderColor: '#E2E8F0',
                            color: currentPage === 1 ? '#94A3B8' : '#0066CC',
                        }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </motion.button>

                    <div className="flex items-center gap-4">
                        <span
                            className="text-sm font-medium"
                            style={{ color: '#64748B' }}
                        >
                            Page{' '}
                            <strong style={{ color: '#0066CC' }}>
                                {currentPage}
                            </strong>{' '}
                            of <strong>{totalPages}</strong>
                        </span>
                        <select
                            value={currentPage}
                            onChange={(e) =>
                                setCurrentPage(Number(e.target.value))
                            }
                            className="px-4 py-2 text-sm border-2 rounded-xl focus:outline-none bg-white font-medium shadow-sm"
                            style={{ borderColor: '#E2E8F0', color: '#0066CC' }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = '#0066CC')
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor = '#E2E8F0')
                            }
                        >
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <option key={page} value={page}>
                                    Page {page}
                                </option>
                            ))}
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border-2 rounded-xl hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        style={{
                            borderColor: '#E2E8F0',
                            color:
                                currentPage === totalPages
                                    ? '#94A3B8'
                                    : '#0066CC',
                        }}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
