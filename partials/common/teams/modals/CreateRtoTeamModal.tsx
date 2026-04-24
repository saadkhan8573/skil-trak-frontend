import {
    Button,
    Select,
    ShowErrorNotifications,
    TextArea,
    TextInput,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { Alert, AlertDescription } from '@components/ui/alert'
import { Checkbox } from '@components/ui/checkbox'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'

import { Briefcase, Info, Plus, Send, SquarePen, Tag } from 'lucide-react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useNotification } from '@hooks'
import { AdminApi, CommonApi } from '@queries'
import { TEAM_TAGS } from '../teams-tabs'
import { UserStatus } from '@types'

type Option = {
    label: string
    value: number
}

type FormValues = {
    name: string
    description: string
    country: Option | null
    state: Option | null
    members: Option[]
    tags: string[]
    isRto: boolean
    selectedRto: Option | null
}

// ----------------------------
// Yup Validation Schema
// ----------------------------
const schema = yup.object().shape({
    name: yup.string().required('Team name is required'),
    description: yup.string().required('Description is required'),
    members: yup
        .array()
        .min(1, 'Select at least one member')
        .nullable()
        .required('Select at least one member'),
    tags: yup.array().optional(),
    isRto: yup.boolean().optional(),
    selectedRto: yup
        .object()
        .nullable()
        .when('isRto', {
            is: true,
            then: (schema) => schema.required('Please select an RTO'),
        }),
})

export const CreateRtoTeamModal = ({
    createTeamOpen,
    setCreateTeamOpen,
    editData,
}: any) => {
    const isEditMode = Boolean(editData)
    const [selectedCountry, setSelectedCountry] = useState<any | undefined>(
        undefined
    )
    const [isRtoSelected, setIsRtoSelected] = useState(false)
    const [selectedRtoId, setSelectedRtoId] = useState<number | undefined>(
        undefined
    )
    const { notification } = useNotification()
    // list/with-permission/receive-tickets

    const coordinators = CommonApi.Coordinators.useCoordinatorByRole()
    const rtosData = CommonApi.Teams.useRtosAllowedForTeam()

    const [createTeam, createTeamResult] =
        CommonApi.Teams.useCreateSupportTeam()

    const [updateTeam, updateTeamResult] = CommonApi.Teams.useEditSupportTeam() // 👈 UPDATE API

    // Fetch subadmins for the selected RTO
    const rtoSubAdmins = CommonApi.Teams.useRtosCoordinatorAllowedForTeam(
        Number(selectedRtoId),
        {
            skip: !selectedRtoId,
        }
    )
    // Use RTO-specific subadmins when RTO is selected, otherwise use all coordinators
    const memberOptions =
        isRtoSelected && selectedRtoId
            ? rtoSubAdmins?.data?.map((subadmin: any) => ({
                  label: subadmin?.user?.name,
                  value: subadmin?.id,
              }))
            : coordinators?.data?.map((coordinator: any) => ({
                  label: coordinator?.user?.name,
                  value: coordinator?.id,
              }))

    const rtoOptions = rtosData?.data?.map((rto: any) => ({
        label: rto?.user?.name,
        value: rto?.id,
    }))

    const { data, isLoading } = CommonApi.Countries.useCountriesList()

    const statesBasedOnCountry = CommonApi.Countries.useCountryStatesList(
        selectedCountry,
        { skip: !selectedCountry }
    )

    const stateOptions = statesBasedOnCountry?.data?.map((state: any) => ({
        label: state?.name,
        value: state?.id,
    }))

    const methods = useForm<FormValues>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            country: null,
            state: null,
            members: [],
            tags: [],
            isRto: false,
            selectedRto: null,
        },
    })
    useEffect(() => {
        if (!editData) return
        const hasRto = editData?.rto?.id
        setIsRtoSelected(!!hasRto)
        methods.reset({
            name: editData?.name,
            description: editData?.description,
            country: editData?.state?.country
                ? {
                      label: editData?.state?.country?.name,
                      value: editData?.state?.country?.id,
                  }
                : null,
            state: editData?.state
                ? { label: editData.state.name, value: editData.state.id }
                : null,
            members: editData?.members?.map((m: any) => ({
                label: m?.subadmin?.user?.name,
                value: m?.subadmin?.id,
            })),
            tags: editData?.tags || [],
            isRto: !!hasRto,
            selectedRto: hasRto
                ? { label: editData?.rto?.name, value: editData?.rto?.id }
                : null,
        })

        setSelectedCountry(editData?.state?.country?.id)
    }, [editData])

    // Handle RTO checkbox change - clear members when unchecking
    useEffect(() => {
        if (!isRtoSelected) {
            methods.setValue('members', [])
            setSelectedRtoId(undefined)
        }
    }, [isRtoSelected])

    // Update selectedRtoId when selectedRto form value changes
    useEffect(() => {
        const subscription = methods.watch((value) => {
            if (isRtoSelected && value.selectedRto?.value) {
                setSelectedRtoId(value.selectedRto.value)
            }
        })
        return () => subscription.unsubscribe()
    }, [isRtoSelected])

    // ----------------------------------
    // SUCCESS HANDLING
    // ----------------------------------
    useEffect(() => {
        if (createTeamResult.isSuccess || updateTeamResult.isSuccess) {
            notification.success({
                title: 'Success',
                description: isEditMode
                    ? 'Team updated successfully'
                    : 'Team created successfully',
            })
            setCreateTeamOpen(false)
            methods.reset()
        }
    }, [createTeamResult.isSuccess, updateTeamResult.isSuccess])

    const selectedTags = methods.watch('tags')

    const toggleTag = (tag: any) => {
        const current = methods.watch('tags') || []
        methods.setValue('tags', current[0] === tag ? [] : [tag])
    }

    // ----------------------------------
    // SUBMIT HANDLER (CREATE + EDIT)
    // ----------------------------------
    const onSubmit = (data: any) => {
        const { members, country, state, selectedRto, ...rest } = data

        const subAdmin = members?.map((member: any) => ({
            subadmin: member?.value,
        }))

        const payload = {
            ...rest,
            country: country?.value,
            state: typeof state === 'object' ? state?.value : state,
            members: subAdmin,
            rto: selectedRto?.value || null,
        }

        if (isEditMode) {
            updateTeam({
                id: editData.id,
                body: payload,
            })
        } else {
            createTeam(payload)
        }
    }

    return (
        <>
            <ShowErrorNotifications result={createTeamResult} />
            <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
                <DialogContent className="max-w-4xl! h-[90vh] p-0 overflow-hidden flex flex-col [&>button:last-child]:text-white [&>button:last-child]:opacity-100">
                    <DialogHeader className="bg-primaryNew px-6 py-3 text-white rounded-t-lg border-b border-white/10 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="h-9 w-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl shrink-0">
                                {isEditMode ? (
                                    <SquarePen className="h-6 w-6 text-white" />
                                ) : (
                                    <Plus className="h-6 w-6 text-white" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-md font-bold tracking-tight text-white leading-none">
                                    {isEditMode
                                        ? 'Edit Team Details'
                                        : 'Create New Support Team'}
                                </DialogTitle>
                                <DialogDescription className="text-blue-50/70 text-xs font-medium leading-relaxed">
                                    {isEditMode
                                        ? 'Update the team information and member assignments below'
                                        : 'Fill in the details below to initialize a new team'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            className="flex flex-col flex-1 overflow-hidden"
                        >
                            <div className="flex-1 overflow-y-auto px-6 space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            1
                                        </span>
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            name="country"
                                            label={'State Country'}
                                            options={data?.map(
                                                (country: any) => ({
                                                    label: country?.name,
                                                    value: country?.id,
                                                })
                                            )}
                                            loading={isLoading}
                                            onChange={(e: any) => {
                                                setSelectedCountry(e?.value)
                                            }}
                                        />
                                        <Select
                                            name="state"
                                            label={'State'}
                                            options={stateOptions}
                                            loading={
                                                statesBasedOnCountry.isLoading
                                            }
                                            disabled={
                                                !selectedCountry ||
                                                statesBasedOnCountry.isLoading
                                            }
                                            onlyValue
                                        />
                                        {/* stateOptions */}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Team Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Team Name{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <TextInput
                                                placeholder="e.g., Compliance Team"
                                                className="h-11"
                                                name="name"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                Description{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <TextArea
                                                placeholder="Responsible for quality assurance and compliance"
                                                name="description"
                                                className="h-24"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* RTO Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            2
                                        </span>
                                        RTO Association (Optional)
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                            <Checkbox
                                                checked={methods.watch('isRto')}
                                                onCheckedChange={(checked) => {
                                                    methods.setValue(
                                                        'isRto',
                                                        checked as boolean
                                                    )
                                                    setIsRtoSelected(
                                                        checked as boolean
                                                    )
                                                    if (!checked) {
                                                        methods.setValue(
                                                            'selectedRto',
                                                            null
                                                        )
                                                    }
                                                }}
                                            />
                                            <Label className="cursor-pointer">
                                                Associate this team with an RTO
                                            </Label>
                                        </div>

                                        {methods.watch('isRto') && (
                                            <Select
                                                name="selectedRto"
                                                label="Select RTO"
                                                placeholder="Select an RTO"
                                                options={rtoOptions}
                                                loading={rtosData?.isLoading}
                                            />
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Members */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            3
                                        </span>
                                        Assign Members
                                    </h3>

                                    <Alert className="py-0! border-secondary/40 bg-secondary/5">
                                        <Briefcase className="h-4 w-4 text-secondary" />
                                        <AlertDescription className="ml-2 text-sm">
                                            Choose which team members will be
                                            part of this team. You can select
                                            multiple members.
                                        </AlertDescription>
                                    </Alert>

                                    <div>
                                        <Select
                                            name="members"
                                            label="Select Members"
                                            placeholder="Select team members"
                                            multi
                                            options={memberOptions}
                                            loading={
                                                isRtoSelected
                                                    ? rtoSubAdmins.isLoading
                                                    : coordinators.isLoading
                                            }
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Tags */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            4
                                        </span>
                                        Support Tags (Optional)
                                    </h3>

                                    <Alert className="border-accent/40 bg-accent/5">
                                        <Info className="h-4 w-4 text-accent" />
                                        <AlertDescription className="ml-2 text-sm space-y-2">
                                            <p className="font-semibold">
                                                About Support Tags:
                                            </p>
                                            <p>
                                                Tags help automatic ticket
                                                routing. Only add them for
                                                members involved in support.
                                            </p>
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-3">
                                        {TEAM_TAGS.map((tag: any) => (
                                            <div
                                                key={tag}
                                                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                            >
                                                <Checkbox
                                                    checked={selectedTags?.includes(
                                                        tag
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleTag(tag)
                                                    }
                                                />
                                                <Label className="cursor-pointer flex items-center gap-2">
                                                    <Tag className="h-3 w-3 text-muted-foreground" />
                                                    {tag}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="px-6 py-2.5 border-t bg-slate-50/50 shrink-0 gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setCreateTeamOpen(false)}
                                    outline
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-linear-to-r from-accent to-warning gap-2"
                                    submit
                                    variant={isEditMode ? 'info' : 'primaryNew'}
                                    loading={
                                        isEditMode
                                            ? updateTeamResult.isLoading
                                            : createTeamResult.isLoading
                                    }
                                    disabled={
                                        isEditMode
                                            ? updateTeamResult.isLoading
                                            : createTeamResult.isLoading
                                    }
                                >
                                    {isEditMode ? (
                                        <SquarePen className="h-4 w-4" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {isEditMode ? 'Update Team' : 'Create Team'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </>
    )
}
