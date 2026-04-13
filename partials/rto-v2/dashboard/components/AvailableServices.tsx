import { ReactElement, useState } from 'react'
import {
    Briefcase,
    FileText,
    Wrench,
    Video,
    Sparkles,
    Star,
    Clock,
    ChevronRight,
    ArrowUpRight,
    Info,
} from 'lucide-react'
import { Badge, Button, Card } from '@components'
import { ServicesFeaturesFormModal, ServicesFeaturesModal } from '../modal'
import { RtoApi, RtoV2Api } from '@queries'
import { PremiumFeatureTypes } from '../enum'

export interface Service {
    title: string
    type: PremiumFeatureTypes
    description: string
    badge: string
    premiumFeature?: number
    variant: 'primaryNew' | 'primary' | 'success'
    icon: any
    featureId:
        | 'expert-consultation'
        | 'mou-legal'
        | 'webinar-platform'
        | 'simulation-tools'
        | 'default'
    duration: string
    colorScheme: {
        cardBg: string
        iconBg: string
        badgeBg: string
        button: string
        buttonVariant: string
    }
}

const services: Service[] = [
    {
        title: 'Expert Industry Consultation',
        description: 'Professional guidance from industry experts',
        badge: 'Most Popular',
        icon: Briefcase,
        type: PremiumFeatureTypes.ExpertIndustryConsultation,
        duration: 'Minimum 2 hours',
        featureId: 'expert-consultation',
        variant: 'primaryNew',
        colorScheme: {
            cardBg: 'bg-gradient-to-br from-primaryNew/5 to-secondary/5 border-primaryNew/20',
            iconBg: 'bg-primaryNew',
            badgeBg: 'bg-primaryNew text-white',
            button: 'bg-gradient-to-r from-primaryNew to-secondary hover:opacity-90',
            buttonVariant: 'primaryNew',
        },
    },
    {
        title: 'MOU & Legal Services',
        description: 'Professional legal and MOU documentation',
        badge: 'Professional',
        icon: FileText,
        type: PremiumFeatureTypes.MouLegalService,
        duration: 'On demand',
        featureId: 'mou-legal',
        variant: 'primary',
        colorScheme: {
            cardBg: 'bg-gradient-to-br from-accent/5 to-warning/5 border-accent/20',
            iconBg: 'bg-gradient-to-br from-primary-light to-primary',
            badgeBg: 'bg-accent text-white',
            button: 'bg-gradient-to-r from-accent to-warning hover:opacity-90',
            buttonVariant: 'primary',
        },
    },
    {
        title: 'Advanced Simulation Tools',
        description: 'Access cutting-edge simulation tools',
        badge: 'Advanced',
        icon: Wrench,
        type: PremiumFeatureTypes.AdvancedSimulationTools,
        duration: 'Per student',
        featureId: 'simulation-tools',
        variant: 'primaryNew',
        colorScheme: {
            cardBg: 'bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20',
            iconBg: 'bg-gradient-to-br from-secondary to-primary',
            badgeBg: 'bg-secondary text-white',
            button: 'bg-gradient-to-r from-secondary to-primaryNew hover:opacity-90',
            buttonVariant: 'primaryNew',
        },
    },
    {
        title: 'Professional Webinar Platform',
        description: 'Host professional webinars and live sessions',
        badge: 'Live Sessions',
        icon: Video,
        type: PremiumFeatureTypes.ProfessionalIndustrySpeaker,
        duration: 'Professional',
        featureId: 'webinar-platform',
        variant: 'success',
        colorScheme: {
            cardBg: 'bg-gradient-to-br from-success/5 to-emerald-500/5 border-success/20',
            iconBg: 'bg-gradient-to-br from-success to-emerald-500',
            badgeBg: 'bg-success text-white',
            button: 'bg-gradient-to-r from-success to-emerald-500 hover:opacity-90',
            buttonVariant: 'error',
        },
    },
]

export const AvailableServices = () => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const { data: rto } = RtoApi.Rto.useProfile()
    const premiumFeatures = RtoV2Api.AvailableServices.premiumFeatures()

    const onCancel = () => setModal(null)

    const getPremiumFeaturesId = (type: PremiumFeatureTypes) => {
        return premiumFeatures?.data?.find(
            (feature: { type: PremiumFeatureTypes }) => feature?.type === type
        )?.id
    }

    const onSubmitInquiry = (service: Service) => {
        const premiumFeature = getPremiumFeaturesId(service?.type)
        setModal(
            <ServicesFeaturesFormModal
                rto={rto}
                service={
                    premiumFeature ? { ...service, premiumFeature } : service
                }
                onCancel={onCancel}
            />
        )
    }
    const onViewDetail = (
        featureId:
            | 'expert-consultation'
            | 'mou-legal'
            | 'webinar-platform'
            | 'simulation-tools'
            | 'default'
    ) => {
        setModal(
            <ServicesFeaturesModal featureId={featureId} onCancel={onCancel} />
        )
    }

    return (
        <div className="space-y-2.5">
            {modal}
            {/* Header - Compact */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="relative group/number">
                        <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-warning/20 rounded-lg blur-lg opacity-40 group-hover/number:opacity-60 transition-opacity"></div>
                        <div className="relative h-9 w-9 rounded-lg bg-primary-light/40 flex items-center justify-center font-bold text-primary shadow-premium group-hover/number:shadow-glow-accent transition-all text-sm">
                            <span className="relative">4</span>
                            <div className="absolute inset-0 rounded-lg bg-linear-to-t from-accent/5 to-transparent"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">
                            Available Services
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Select a service to submit an enquiry
                        </p>
                    </div>
                </div>

                {/* <Button
                    // variant="outline"
                    size="sm"
                    className="border-accent/30 hover:bg-accent/5 gap-1.5 h-8"
                >
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span className="text-xs">View All Services</span>
                    <ChevronRight className="h-3 w-3" />
                </Button> */}
            </div>

            {/* Services Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {services.map((service, index) => {
                    const Icon = service.icon
                    return (
                        <Card
                            key={index}
                            className={`border ${service.colorScheme.cardBg} shadow-premium-lg hover:shadow-premium-xl transition-all hover-lift relative overflow-hidden group/service`}
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-white/40 to-transparent rounded-bl-full opacity-0 group-hover/service:opacity-100 transition-opacity"></div>

                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/service:opacity-100 transition-opacity"></div>

                            <div className="p-3 relative space-y-2.5">
                                {/* Icon & Badge */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="relative shrink-0">
                                        <div
                                            className={`absolute inset-0 ${service.colorScheme.iconBg} rounded-lg blur opacity-30`}
                                        ></div>
                                        <div
                                            className={`relative h-8 w-8 rounded-lg ${service.colorScheme.iconBg} flex items-center justify-center shadow-premium group-hover/service:scale-110 transition-transform`}
                                        >
                                            <Icon className="h-4 w-4 text-white" />
                                            <div className="absolute inset-0 rounded-lg bg-linear-to-t from-white/0 to-white/20"></div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            service.colorScheme
                                                .buttonVariant as any
                                        }
                                        text={service.badge}
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-sm leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{service.duration}</span>
                                </div>

                                {/* Action Button */}
                                <Button
                                    variant={
                                        service?.colorScheme
                                            ?.buttonVariant as any
                                    }
                                    onClick={() => onSubmitInquiry(service)}
                                    Icon={() => <ArrowUpRight size={12} />}
                                    text="Submit Enquiry"
                                    fullWidth
                                />

                                {/* View Details Button */}
                                <Button
                                    variant={
                                        service?.colorScheme
                                            ?.buttonVariant as any
                                    }
                                    outline
                                    fullWidth
                                    onClick={() =>
                                        onViewDetail(service?.featureId)
                                    }
                                >
                                    <Info className="h-3 w-3 mr-1 group-hover/details:scale-110 transition-transform" />
                                    View Details
                                    <ChevronRight className="h-3 w-3 ml-auto group-hover/details:translate-x-0.5 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Submit Enquiry Dialog */}
            {/* <SubmitEnquiryDialog
                open={enquiryDialogOpen}
                onClose={() => setEnquiryDialogOpen(false)}
                service={selectedService}
            /> */}
        </div>
    )
}
