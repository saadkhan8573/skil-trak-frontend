import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/router'
import moment from 'moment'

const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<
        string,
        { label: string; color: string; bgColor: string; borderColor: string }
    > = {
        IN_PROGRESS: {
            label: 'In Progress',
            color: '#0369A1',
            bgColor: '#F0F9FF',
            borderColor: '#BAE6FD',
        },
        COMPLETED: {
            label: 'Completed',
            color: '#15803D',
            bgColor: '#F0FDF4',
            borderColor: '#BBF7D0',
        },
        EXPIRED: {
            label: 'Expired',
            color: '#B91C1C',
            bgColor: '#FEF2F2',
            borderColor: '#FECACA',
        },
    }

    const config = configs[status] || configs.IN_PROGRESS

    return (
        <span
            className="px-3 py-1 rounded-full text-xs font-semibold border"
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
            }}
        >
            {config.label}
        </span>
    )
}

export const EsignHeader = ({ documentDetail }: { documentDetail?: any }) => {
    const router = useRouter()

    const title = documentDetail?.template?.name
    const createdAt = documentDetail?.createdAt
    const lastModified = documentDetail?.updatedAt
    const status = documentDetail?.status

    return (
        <div
            className="min-h-fit"
            style={{
                background: 'linear-gradient(to bottom, #F8FAFC, #F1F5F9)',
            }}
        >
            {/* Header */}
            <header
                className="bg-white border-b shadow-sm"
                style={{ borderColor: '#E2E8F0' }}
            >
                <div className="mx-auto p-4 md:p-6">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: -4 }}
                        onClick={() => router.back()}
                        className="cursor-pointer text-sm flex items-center gap-2 mb-4 font-medium transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={(e: any) =>
                            (e.currentTarget.style.color = '#0066CC')
                        }
                        onMouseLeave={(e: any) =>
                            (e.currentTarget.style.color = '#64748B')
                        }
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </motion.button>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                        <div className="flex-1 w-full">
                            <h1
                                className="text-xl md:text-2xl font-bold break-words"
                                style={{ color: '#0F172A' }}
                            >
                                {title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                <span
                                    className="text-xs md:text-sm flex items-center gap-1.5 whitespace-nowrap"
                                    style={{ color: '#64748B' }}
                                >
                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    Created:{' '}
                                    {moment(createdAt).format('MMMM D, YYYY')}
                                </span>
                                <span
                                    className="hidden md:block"
                                    style={{ color: '#CBD5E1' }}
                                >
                                    •
                                </span>
                                <span
                                    className="text-xs md:text-sm flex items-center gap-1.5 whitespace-nowrap"
                                    style={{ color: '#64748B' }}
                                >
                                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    Modified:{' '}
                                    {moment(lastModified).format(
                                        'MMMM D, YYYY'
                                    )}
                                </span>
                            </div>
                        </div>
                        <StatusBadge status={status} />
                    </motion.div>
                </div>
            </header>
        </div>
    )
}
