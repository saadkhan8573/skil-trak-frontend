import { ActionRequiredHeader } from '../../components'
import { Users } from 'lucide-react'
import { useRouter } from 'next/router'

interface CoordinatorHeaderProps {
    coordinator: any
}

export const CoordinatorHeader = ({ coordinator }: CoordinatorHeaderProps) => {
    const router = useRouter()

    return (
        <ActionRequiredHeader
            icon={Users}
            title={coordinator?.user?.name || 'Coordinator Detail'}
            description={`Manage details and permissions for ${coordinator?.user?.name || 'this team member'}`}
            gradientFrom="primaryNew"
            gradientTo="primaryNew"
            iconGradient="from-primaryNew to-primaryNew"
            actionButton={{
                label: 'Back to Team',
                icon: Users,
                onClick: () => router.push('/portals/rto/manage/team'),
            }}
        />
    )
}
