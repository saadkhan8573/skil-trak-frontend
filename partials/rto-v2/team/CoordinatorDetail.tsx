import {
    Card,
    EmptyData,
    LoadingAnimation,
    TechnicalError,
    Typography,
} from '@components'
import { RtoApi } from '@queries'
import { useRouter } from 'next/router'
import { CoordinatorHeader } from './components'
import { RtoInfo } from '../student-detail/components'
import { Mail, Phone, MapPin, User, Hash } from 'lucide-react'

export const CoordinatorDetail = () => {
    const router = useRouter()
    const { id } = router.query

    const { data, isLoading, isSuccess, isError } =
        RtoApi.Coordinator.useDetail(Number(id), {
            skip: !id,
        })

    const infoItems = [
        {
            label: 'Coordinator Id',
            value: data?.coordinatorId,
            icon: Hash,
        },
        {
            label: 'Name',
            value: data?.user?.name,
            icon: User,
        },
        {
            label: 'Email',
            value: data?.user?.email,
            icon: Mail,
        },
        {
            label: 'Phone',
            value: data?.phone,
            icon: Phone,
        },
        {
            label: 'Address',
            value: data?.addressLine1,
            icon: MapPin,
        },
    ]

    return (
        <div className="bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen">
            <main className="w-full mx-auto space-y-4">
                {isError && <TechnicalError />}

                {isLoading ? (
                    <LoadingAnimation height="h-[60vh]" />
                ) : !data ? (
                    !isError &&
                    isSuccess && (
                        <EmptyData
                            title={'No Coordinator Found'}
                            description={
                                'Coordinator Detail were not found on your request'
                            }
                        />
                    )
                ) : (
                    <>
                        <CoordinatorHeader coordinator={data} />

                        <Card className="border-border/60 shadow-premium-lg overflow-hidden">
                            <div className="border-b bg-secondary-light/30 p-4">
                                <Typography
                                    variant="title"
                                    className="text-slate-900 font-semibold flex items-center gap-2"
                                >
                                    <User className="h-5 w-5 text-primaryNew" />
                                    Personal Information
                                </Typography>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {infoItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-1.5"
                                    >
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <item.icon className="h-4 w-4" />
                                            <Typography
                                                variant="muted"
                                                className="text-[13px] font-medium uppercase tracking-wider"
                                            >
                                                {item.label}
                                            </Typography>
                                        </div>
                                        <Typography className="text-slate-900 font-medium break-all">
                                            {item.value || 'N/A'}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}
            </main>
        </div>
    )
}
