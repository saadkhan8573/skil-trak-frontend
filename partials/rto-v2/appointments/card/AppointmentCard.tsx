import { Card, Portal } from '@components'
import { RescheduleAppointmentModal } from '@components/Appointment/UpcomingAppointmentCard/RescheduleAppointmentModal'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Separator } from '@components/ui/separator'
import {
    AlertCircle,
    Ban,
    CheckCircle2,
    Clock,
    Edit,
    FileText,
    Link2,
    MapPin,
    Phone,
    Users,
    Video,
    XCircle
} from 'lucide-react'
import { ReactNode, useState } from 'react'
import { CancelRtoAppointmentModal } from '../modals'
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'
export type AppointmentType = 'meeting' | 'phone' | 'video' | 'site-visit'
export interface Appointment {
    id: string
    title: string
    description: string
    duration: string
    participants?: any
    location?: string
    meetingLink?: string
    priority: 'high' | 'medium' | 'low'
    clientName?: string
    email?: string
    phone?: string
    date: string
    time: string
    service?: string
    status: AppointmentStatus
    notes?: string
    type?: AppointmentType
}

interface AppointmentCardProps {
    onAppointmentClicked?: any
    appointment: any
    isPast?: boolean
}

export const AppointmentCard = ({
    appointment,
    // onEdit,
    // onDelete,
    // onStatusChange,
    // onViewDetails,
    onAppointmentClicked,
    isPast = false
}: AppointmentCardProps) => {
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null)
    const [modal, setModal] = useState<ReactNode | null>(null)

    const onCancel = () => {
        setModal(null)
    }
    const onClickCancelAppointment = () => {
        setModal(
            <CancelRtoAppointmentModal
                appointment={appointment}
                onCancel={onCancel}
            />
        )
    }
    const onRescheduleClicked = () => {
        setModal(
            <Portal>
                <RescheduleAppointmentModal
                    onCancel={onCancel}
                    appointment={appointment}
                />
            </Portal>
        )
    }

    const getTypeIcon = (type: Appointment['type']) => {
        switch (type) {
            case 'video':
                return <Video className="h-4 w-4" />
            case 'phone':
                return <Phone className="h-4 w-4" />
            case 'site-visit':
                return <MapPin className="h-4 w-4" />
            default:
                return <Users className="h-4 w-4" />
        }
    }

    const getTypeColor = (type: Appointment['type']) => {
        switch (type) {
            case 'video':
                return 'bg-primary/10 text-primary border-primary/20'
            case 'phone':
                return 'bg-secondary/10 text-secondary border-secondary/20'
            case 'site-visit':
                return 'bg-accent/10 text-accent border-accent/20'
            default:
                return 'bg-muted text-muted-foreground border-border'
        }
    }

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'upcoming':
                return 'bg-success/10 text-success border-success/20'
            // case 'pending':
            //     return 'bg-warning/10 text-warning border-warning/20'
            case 'cancelled':
                return 'bg-destructive/10 text-destructive border-destructive/20'
            case 'completed':
                return 'bg-muted text-muted-foreground border-border'
            default:
                return 'bg-muted text-muted-foreground border-border'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const dateOnly = dateString
        const todayOnly = today.toISOString().split('T')[0]
        const tomorrowOnly = tomorrow.toISOString().split('T')[0]
        const yesterdayOnly = yesterday.toISOString().split('T')[0]

        if (dateOnly === todayOnly) {
            return 'Today'
        } else if (dateOnly === tomorrowOnly) {
            return 'Tomorrow'
        } else if (dateOnly === yesterdayOnly) {
            return 'Yesterday'
        }

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <>
            {modal && modal}
            <div className="">
                <div className="space-y-3">
                    {/* Date Header */}
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 pb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">
                                {formatDate(appointment?.date)}
                            </h3>
                            {/* <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {groupedAppointments[date].length}{" "}
                                                    {groupedAppointments[date].length === 1 ? "appointment" : "appointments"}
                                                </p>
                                            </div> */}
                            {/* <Badge variant="outline" className="border-accent/30 bg-accent/5 text-accent">
                                                {new Date(date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </Badge> */}
                        </div>
                        <Separator className="mt-3" />
                    </div>

                    {/* Appointments Timeline */}
                    <div className="space-y-3 pl-4">
                        <div className="relative">
                            {/* Timeline connector */}
                            {/* {index !== groupedAppointments[date].length - 1 && (
                                                        <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-border/50" />
                                                    )} */}

                            <div
                                className={`border-border/40 cursor-pointer transition-all hover-lift ml-10 ${selectedAppointment?.id === appointment.id
                                    ? 'shadow-premium border-accent/40 bg-accent/5'
                                    : 'hover:shadow-premium-lg hover:border-border'
                                    }`}
                                onClick={() =>
                                    setSelectedAppointment(appointment)
                                }
                            >
                                {/* Timeline dot */}
                                <div
                                    className={`absolute -left-10 top-6 h-10 w-10 rounded-full border-4 border-background flex items-center justify-center shadow-md ${appointment.status === 'completed'
                                        ? 'bg-success'
                                        : appointment.status === 'cancelled'
                                            ? 'bg-destructive'
                                            : appointment?.status === 'upcoming'
                                                ? 'bg-warning'
                                                : 'bg-primary'
                                        }`}
                                >
                                    {appointment.status === 'completed' ? (
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                    ) : appointment.status === 'cancelled' ? (
                                        <XCircle className="h-5 w-5 text-white" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-white" />
                                    )}
                                </div>

                                <Card className="p-4">
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge className="gap-1 bg-linear-to-r from-primary to-accent text-white border-0 shadow-sm">
                                                        <Clock className="h-3 w-3" />
                                                        {appointment?.startTime}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`gap-1 ${getTypeColor(
                                                            appointment.type
                                                        )}`}
                                                    >
                                                        {getTypeIcon(
                                                            appointment.type
                                                        )}
                                                        {/* {appointment?.type?.replace("-", " ")} */}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${getStatusColor(
                                                            appointment.status
                                                        )}`}
                                                    >
                                                        {appointment.status}
                                                    </Badge>

                                                    {appointment.priority ===
                                                        'high' && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="gap-1"
                                                            >
                                                                <AlertCircle className="h-3 w-3" />
                                                                High Priority
                                                            </Badge>
                                                        )}
                                                </div>
                                                <h3 className="font-semibold text-base mb-1">
                                                    {appointment?.type?.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {appointment?.note ?? 'NA'}
                                                </p>
                                            </div>
                                            {/* {appointment?.isCancelled || !isPast && (
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="shrink-0"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownContent align="end">
                                                        <DropdownItem
                                                            onSelect={
                                                                onRescheduleClicked
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Reschedule
                                                        </DropdownItem>
                                                        
                                                        <DropdownSeparator />
                                                        {appointment.status !==
                                                            'cancelled' && (
                                                                <DropdownItem
                                                                    onSelect={
                                                                        onClickCancelAppointment
                                                                    }
                                                                    className="gap-2 text-destructive"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                    Cancel
                                                                    Appointment
                                                                </DropdownItem>
                                                            )}
                                                    </DropdownContent>
                                                </Dropdown>
                                            )} */}
                                        </div>

                                        <Separator />

                                        {/* Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="font-medium">
                                                    Duration:{' '}
                                                    {appointment?.type
                                                        ?.duration ?? 0}
                                                </span>
                                            </div>

                                            {/* <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="truncate text-muted-foreground">
                                                    {appointment?.address ??
                                                        'Not Provided'}
                                                </span>
                                            </div> */}
                                            {appointment?.joinUrl !== null && (
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <a
                                                        href={
                                                            appointment?.joinUrl ??
                                                            '#'
                                                        }
                                                        className="text-primary hover:underline truncate"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        Join Meeting
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Participants */}
                                        <div className="flex items-start gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                            <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                                                {appointment?.type?.appointmentParticipants?.map(
                                                    (
                                                        participant: any,
                                                        index: number
                                                    ) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {participant}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {appointment?.notes && (
                                            <div className="flex items-start gap-2 pt-2 border-t">
                                                <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                <p className="text-sm text-muted-foreground italic">
                                                    {appointment?.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Quick Actions */}

                                        <div className="flex items-center gap-2 pt-2">
                                            {appointment?.joinUrl && (
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-linear-to-r from-primary to-accent hover:shadow-glow-primary transition-all hover-lift"
                                                >
                                                    <Video className="h-3.5 w-3.5" />
                                                    Join Now
                                                </Button>
                                            )}
                                            {appointment?.isCancelled || !isPast && (
                                                <>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="gap-2 hover-lift"
                                                        onClick={
                                                            onClickCancelAppointment
                                                        }
                                                    >
                                                        <Ban className="h-3.5 w-3.5" />
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="gap-2 hover-lift"
                                                        onClick={
                                                            onRescheduleClicked
                                                        }
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Reschedule
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
