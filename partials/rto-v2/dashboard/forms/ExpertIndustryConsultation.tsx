import { Select, ShowErrorNotifications, TextArea } from '@components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotification } from '@hooks'
import { RtoV2Api } from '@queries'
import { Rto } from '@types'
import { MessageSquare } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import {
    InfoBanner,
    RtoInfoCard,
    Service,
    ServiceFormActions,
    ViewUploadedFiles,
} from '../components'
import { Title } from '@partials/rto-v2'
import {
    AvailableServiceBaseForm,
    AvailableServiceCourseForm,
    FileUpload,
} from '../forms'
import { useSubmitForm } from '../hooks'

export const ExpertIndustryConsultation = ({
    service,
    rto,
    onCancel,
}: {
    onCancel: () => void
    rto: Rto
    service: Service
}) => {
    const { onSubmit, submitResult } = useSubmitForm({ onCancel })

    const validationSchema = Yup.object({
        // Base form fields
        contactPersonName: Yup.string().required('Full name is required'),
        role: Yup.string().required('Role/Title is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),

        // Course selection
        courses: Yup.array()
            .min(1, 'Please select at least one course')
            .required('Course selection is required'),

        // Service specific fields
        description: Yup.string()
            .min(50, 'Please provide at least 50 characters')
            .max(1000, 'Description must not exceed 1000 characters')
            .required('Challenge/Goal description is required'),
        timeline: Yup.string().required('Timeline/Urgency is required'),

        // File upload
        fileUpload: Yup.array().optional(),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            description: '',
            ...(service?.premiumFeature && {
                premiumFeature: service?.premiumFeature,
            }),
        },
    })

    const getServiceColor = () => {
        switch (service?.title) {
            case 'Expert Industry Consultation':
                return {
                    from: 'from-primaryNew',
                    to: 'to-primaryNew',
                    bg: 'bg-primaryNew/5',
                }
            case 'MOU & Legal Services':
                return {
                    from: 'from-primary',
                    to: 'to-primary-light',
                    bg: 'bg-primary/5',
                }
            case 'Advanced Simulation Tools':
                return {
                    from: 'from-primaryNew',
                    to: 'to-primaryNew',
                    bg: 'bg-primaryNew/5',
                }
            case 'Professional Webinar Platform':
                return {
                    from: 'from-success',
                    to: 'to-success-dark',
                    bg: 'bg-success/5',
                }
            default:
                return {
                    from: 'from-primary',
                    to: 'to-secondary',
                    bg: 'bg-primary/5',
                }
        }
    }

    const colors = getServiceColor()

    const description = methods.watch('description')

    return (
        <>
            <ShowErrorNotifications result={submitResult} />
            <FormProvider {...methods}>
                <form
                    // id="enquiry-form"
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-3.5"
                >
                    {/* RTO Information Card */}
                    <RtoInfoCard rto={rto} variant={service?.variant} />

                    {/* Contact Person Section */}
                    <AvailableServiceBaseForm variant={service?.variant} />

                    <div className="h-0.5 w-full bg-gray-300" />
                    {/* Service-Specific Fields */}
                    <div className="space-y-4">
                        <Title
                            Icon={MessageSquare}
                            title="Service Details"
                            description="Please provide the following information"
                            iconClasses={`bg-gradient-to-br ${colors.from} ${colors.to}`}
                        />

                        {/* Expert Industry Consultation Fields */}

                        <div className="space-y-4">
                            <AvailableServiceCourseForm rto={rto} />
                            <div className="space-y-2">
                                <TextArea
                                    placeholder="Describe the challenge you're facing or the goal you want to achieve..."
                                    label={'Describe Your Challenge / Goal'}
                                    rows={5}
                                    required
                                    name="description"
                                    recomendedText="500-1000 characters recommended"
                                    textInfo={
                                        <p
                                            className={
                                                description?.length > 1000
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }
                                        >
                                            {description?.length || 0}
                                            /1000
                                        </p>
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Select
                                        name={'timeline'}
                                        label={'Timeline/Urgency'}
                                        options={[
                                            {
                                                label: 'ASAP',
                                                value: 'asap',
                                            },
                                            {
                                                label: '2-4 weeks',
                                                value: '2-4weeks',
                                            },
                                            {
                                                label: 'More than 1 month',
                                                value: '1month+',
                                            },
                                        ]}
                                        onlyValue
                                    />
                                </div>

                                <FileUpload />
                            </div>

                            <ViewUploadedFiles variant={service?.variant} />
                        </div>
                    </div>
                    {/* Info Banner */}
                    <InfoBanner colors={colors} service={service} />

                    <ServiceFormActions
                        onCancel={onCancel}
                        variant={service?.variant}
                        loading={submitResult?.isLoading}
                    />
                </form>
            </FormProvider>
        </>
    )
}
