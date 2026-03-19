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
import { CommonApi } from '@queries'
import { TEAM_TAGS } from '../teams-tabs'

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
})

export const CreateTeamModal = ({
    createTeamOpen,
    setCreateTeamOpen,
    editData,
}: any) => {
    const isEditMode = Boolean(editData)
    const [selectedCountry, setSelectedCountry] = useState<any | undefined>(
        undefined
    )
    const { notification } = useNotification()

    const coordinators = CommonApi.Coordinators.useCoordinatorByRole()

    const [createTeam, createTeamResult] =
        CommonApi.Teams.useCreateSupportTeam()

    const [updateTeam, updateTeamResult] = CommonApi.Teams.useEditSupportTeam() // 👈 UPDATE API

    const memberOptions = coordinators?.data?.map((coordinator: any) => ({
        label: coordinator?.user?.name,
        value: coordinator?.id,
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
        },
    })
    useEffect(() => {
        if (!editData) return
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
        })

        setSelectedCountry(editData?.state?.country?.id)
    }, [editData])

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
        const { members, country, state, ...rest } = data

        const subAdmin = members?.map((member: any) => ({
            subadmin: member?.value,
        }))

        const payload = {
            ...rest,
            country: country?.value,
            state: typeof state === 'object' ? state?.value : state,
            members: subAdmin,
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-yell-400 to-warning flex items-center justify-center">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            Create New Team
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new team
                        </DialogDescription>
                    </DialogHeader>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <div className="space-y-6 py-4">
                                {/* Basic Info */}
                                <div className="space-y-4">
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

                                {/* Members */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            2
                                        </span>
                                        Assign Members
                                    </h3>

                                    <Alert className="border-secondary/40 bg-secondary/5">
                                        <Briefcase className="h-4 w-4 text-secondary" />
                                        <AlertDescription className="ml-2 text-sm">
                                            Choose which team members will be
                                            part of this team. You can select
                                            multiple members.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Select
                                            name="members"
                                            label="Select Members"
                                            placeholder="Select team members"
                                            multi
                                            options={memberOptions}
                                            loading={coordinators.isLoading}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                {/* Tags */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            3
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

                            <DialogFooter className="gap-2">
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
