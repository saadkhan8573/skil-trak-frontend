import { Desktop, Mobile } from '@components/Responsive'
import { getUserCredentials } from '@utils'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { FaBriefcase } from 'react-icons/fa'
import { MdAssessment, MdSpaceDashboard } from 'react-icons/md'
import { IoMdMail } from 'react-icons/io'

import { LiaCertificateSolid } from 'react-icons/lia'

import { NavLinkItem } from '../NavLinkItem'
import { StudentApi } from '@queries'

const PREFIX = '/portals/student'

const Routes = {
    Dashboard: `${PREFIX}`,
    Workplace: `${PREFIX}/workplace`,
    Jobs: `${PREFIX}/jobs?tab=jobs`,
    Assessments: `${PREFIX}/assessments`,
    Mails: `${PREFIX}/mails`,
    TalentPool: `${PREFIX}/talent-pool`,
}

export const StudentNavbar = () => {
    const router = useRouter()
    const requestCount = StudentApi.TalentPool.useIndustryRequestCount()
    const talentPoolStudentProfileDetail =
        StudentApi.TalentPool.useTalentPoolStudentProfile()
    const status = getUserCredentials()?.status

    const defaultClasses = classNames({
        'transition-all duration-300 px-2.5 py-2 flex flex-col md:flex-row gap-x-2 items-center rounded-md':
            true,
    })
    const checkProfile =
        talentPoolStudentProfileDetail?.data != null &&
        Object.keys(talentPoolStudentProfileDetail?.data)?.length > 0

    const studentPortalData = [
        {
            link: Routes.Dashboard,
            text: 'Dashboard',
            Icon: MdSpaceDashboard,
            activeClasses: 'bg-indigo-100 text-indigo-700',
            inActiveClasses: 'text-slate-700',
        },
        {
            link: `${Routes.Workplace}`,
            text: 'Workplace',
            Icon: FaBriefcase,
            activeClasses: 'bg-green-100 text-green-700',
            inActiveClasses: 'text-slate-700',
            id: 'workplace',
        },
        {
            link: `${Routes.Jobs}`,
            text: 'Jobs',
            Icon: FaBriefcase,
            activeClasses: 'bg-green-100 text-green-700',
            inActiveClasses: 'text-slate-700',
            id: 'workplace',
        },
        {
            link: checkProfile
                ? '/portals/student/talent-pool/profile'
                : Routes.TalentPool,
            text: 'Talent Pool',
            Icon: LiaCertificateSolid,
            activeClasses: 'bg-blue-100 text-blue-700',
            inActiveClasses: 'text-slate-700',
            count: requestCount?.data,
        },
        {
            link: `${Routes.Assessments}`,
            text: 'Assessments',
            Icon: MdAssessment,
            activeClasses: 'bg-orange-100 text-orange-700',
            inActiveClasses: 'text-slate-700',
            id: 'assessments',
        },
        {
            link: `${Routes.Mails}`,
            text: 'Mails',
            Icon: IoMdMail,
            activeClasses: 'bg-blue-100 text-blue-700',
            inActiveClasses: 'text-slate-700',
        },
    ]

    return (
        <>
            <Desktop>
                <ul className="flex gap-x-2 py-4">
                    {studentPortalData.map((nav, i) => (
                        <NavLinkItem key={i} nav={nav} PREFIX={PREFIX} />
                    ))}
                </ul>
            </Desktop>
            <Mobile>
                <ul
                    className="w-screen overflow-auto custom-scrollbar flex justify-evenly py-1.5 fixed bottom-0 left-0 right-0 bg-white z-30"
                    style={{
                        boxShadow: `0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`,
                    }}
                >
                    <li>
                        <Link href="/portals/student" className={`${
                            router.pathname == '/student'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-slate-700'
                        } ${defaultClasses} hover:bg-indigo-100 hover:text-indigo-700`}>

                            <div>
                                <MdSpaceDashboard size={19} />
                            </div>
                            <div className="text-[11px] font-semibold">
                                Dashboard
                            </div>

                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/portals/student/workplace"
                            className={`${
                                router.pathname ==
                                '/portals/student/workplace'
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-slate-700'
                            } ${defaultClasses} hover:bg-green-100 hover:text-green-700`}
                            id="workplace">

                            <span>
                                <FaBriefcase size={19} />
                            </span>
                            <span className="text-[11px] font-semibold">
                                Workplace
                            </span>

                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/portals/student/assessments"
                            className={`${
                                router.pathname ==
                                '/portals/student/assessments'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'text-slate-700'
                            } ${defaultClasses} hover:bg-orange-100 hover:text-orange-700`}
                            id="assessments">

                            <span>
                                <MdAssessment size={19} />
                            </span>
                            <span className="text-[11px] font-semibold">
                                Assessments
                            </span>

                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/portals/student/talent-pool"
                            className={`${
                                router.pathname ==
                                '/portals/student/talent-pool'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'text-slate-700'
                            } ${defaultClasses} hover:bg-orange-100 hover:text-orange-700`}
                            id="talent-pool">

                            <span>
                                <LiaCertificateSolid size={19} />
                            </span>
                            <span className="text-[11px] font-semibold whitespace-pre">
                                Talent Pool
                            </span>

                        </Link>
                    </li>
                </ul>
            </Mobile>
        </>
    );
}
