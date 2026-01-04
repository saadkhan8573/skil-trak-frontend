import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
    Building2,
    ClipboardCheck,
    GraduationCap,
    Grid3x3,
    Users,
} from 'lucide-react'
import { useRouter } from 'next/router'
import {
    AllTeamsTabs,
    IndustrySourcingTab,
    QATeamTab,
    RtoTeamTab,
    StudentServicesTab,
} from '../tickets-tabs'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'

export enum TAGS {
    STUDENT_SERVICES = 'student services',
    QUALITY_ASSURANCE = 'quality assurance',
    ADMIN = 'admin',
    SOURCING_TEAM = 'sourcing team',
    RTO_TEAM = 'rto team',
}

export const TeamTabsList = () => {
    const router = useRouter()
    const tabName = router.query.tab
    const role = getUserCredentials()?.role
    const teamTabs = [
        {
            id: 'all',
            label: 'All Teams',
            icon: Grid3x3,
            element: <AllTeamsTabs />,
        },
        {
            id: 'student-services',
            label: 'Student Services',
            icon: GraduationCap,
            element: <StudentServicesTab />,
        },
        {
            id: 'industry-sourcing',
            label: 'Industry Sourcing',
            icon: Building2,
            element: <IndustrySourcingTab />,
        },
        {
            id: 'rto',
            label: 'RTO Team',
            icon: ClipboardCheck,
            element: <RtoTeamTab />,
        },
        {
            id: 'qa',
            label: 'QA Team',
            icon: Users,
            element: <QATeamTab />,
        },
    ]
    const visibleTabs = teamTabs.filter((tab) => {
        if (role === UserRoles.ADMIN) return true
        if (role === UserRoles.RTO) return tab.id === 'rto'
        return false
    })
    const defaultTab =
        role === UserRoles.ADMIN
            ? 'all'
            : role === UserRoles.RTO
            ? 'rto'
            : visibleTabs[0]?.id

    return (
        <>
            <Tabs defaultValue={defaultTab} className="w-full mt-6">
                <TabsList className="flex flex-wrap gap-3 bg-transparent p-0 shadow-none">
                    {visibleTabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={`
                                            group relative flex items-center gap-2 px-3 py-5 rounded-xl text-sm transition-all duration-300
        
                                            /* ACTIVE */
                                            data-[state=active]:bg-primary 
                                            data-[state=active]:text-white 
                                            data-[state=active]:shadow-lg 
                                            data-[state=active]:shadow-primary/20 
                                            data-[state=active]:scale-105
        
                                            /* INACTIVE */
                                            data-[state=inactive]:bg-white 
                                            data-[state=inactive]:text-primaryNew
                                            data-[state=inactive]:shadow 
                                            data-[state=inactive]:border 
                                            data-[state=inactive]:border-gray-200
                                            data-[state=inactive]:hover:bg-gray-50
                                `}
                            >
                                {/* Glow effect */}
                                <div
                                    className={`
                                                absolute inset-0 rounded-lg blur opacity-30 
                                                bg-[#F7A619] 
                                                hidden
                                                data-[state=active]:block
                                            `}
                                ></div>

                                <div className="relative z-10 flex items-center gap-2">
                                    <Icon
                                        className={`
                                                    w-4 h-4 transition-transform duration-300
                                                    data-[state=active]:scale-110
                                                    group-hover:scale-110
                                                `}
                                    />
                                    <span>{tab.label}</span>
                                </div>

                                {/* Hover underline (only inactive) */}
                                <div
                                    className={`
                                                absolute bottom-0 left-0 right-0 h-0.5 bg-[#044866] rounded-full 
                                                transform scale-x-0 transition-transform duration-300
                                                group-hover:scale-x-100
                                                data-[state=active]:hidden
                                            `}
                                ></div>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                {visibleTabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-4">
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                            <h2 className="text-lg capitalize font-semibold text-[#044866]">
                                {tab.label} - {tabName}
                            </h2>
                            <div className="py-4">{tab.element}</div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </>
    )
}
