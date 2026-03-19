import { Button, Select, TextInput } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { Alert, AlertDescription } from '@components/ui/alert'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { Checkbox } from '@components/ui/checkbox'

import {
    Briefcase,
    Crown,
    GraduationCap,
    Info,
    Send,
    Shield,
    Tag,
    UserPlus,
} from 'lucide-react'

import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AVAILABLE_TEAMS, TEAM_TAGS } from '../teams-tabs'

const memberAccessLevelsOptions = [
    {
        label: 'RTO-Admin',
        value: 'admin',
        description: 'Full access to everything',
    },
    {
        label: 'Coordinator',
        value: 'coordinator',
        description: 'Manage placements & students',
    },
    {
        label: 'Assessor',
        value: 'assessor',
        description: 'Assessment tasks only',
    },
    { label: 'Viewer', value: 'viewer', description: 'Read-only access' },
]

// ----------------------------
// Form Types & Yup Schema
// ----------------------------
interface TeamMemberFormValues {
    name: string
    email: string
    role?: string
    phone?: string
    accessLevel: string
    departments: string[]
    tags: string[]
}

const schema = yup.object({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    role: yup.string().optional(),
    phone: yup.string().optional(),
    accessLevel: yup
        .object({
            value: yup.string().required(),
        })
        .nullable()
        .required('Select at least one access level'),

    departments: yup
        .array()
        .of(yup.string())
        .when('accessLevel', {
            is: (val: string) => val !== 'admin',
            then: yup.array().min(1, 'Select at least one department'),
            otherwise: yup.array().notRequired(),
        }),
    tags: yup.array().of(yup.string()).optional(),
})

export const TeamMemberModal = ({ addMemberOpen, setAddMemberOpen }: any) => {
    const methods = useForm<TeamMemberFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            role: '',
            phone: '',
            accessLevel: '',
            departments: [],
            tags: [],
        },
    })

    const { watch, setValue } = methods
    const selectedAccessLevel = watch('accessLevel')
    const selectedTags = watch('tags')
    const selectedDepartments = watch('departments')

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setValue(
                'tags',
                selectedTags.filter((t) => t !== tag)
            )
        } else {
            setValue('tags', [...selectedTags, tag])
        }
    }

    const toggleDepartment = (dept: string) => {
        if (selectedDepartments.includes(dept)) {
            setValue(
                'departments',
                selectedDepartments.filter((d) => d !== dept)
            )
        } else {
            setValue('departments', [...selectedDepartments, dept])
        }
    }

    const onSubmit = (data: TeamMemberFormValues) => {
        methods.reset()
        setAddMemberOpen(false)
    }

    return (
        <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primaryNew to-secondaryNew flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        Add New Team Member
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below and we'll send an email
                        invitation automatically
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
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Full Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <TextInput
                                            placeholder="e.g., John Smith"
                                            className="h-11"
                                            name="name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <TextInput
                                            {...methods.register('email')}
                                            type="email"
                                            placeholder="john.smith@example.com"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Job Title/Role</Label>
                                    <TextInput
                                        {...methods.register('role')}
                                        placeholder="e.g., Placement Coordinator"
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        Phone Number (Optional)
                                    </Label>
                                    <TextInput
                                        {...methods.register('phone')}
                                        type="text"
                                        placeholder="+61 3 9876 5432"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Access Level */}
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2 text-lg">
                                    <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                        2
                                    </span>
                                    Access Level
                                </h3>

                                <Alert className="border-primaryNew/40 bg-primaryNew/5">
                                    <Shield className="h-4 w-4 text-primaryNew" />
                                    <AlertDescription className="ml-2 text-sm">
                                        This determines what they can do in the
                                        system. Choose carefully!
                                    </AlertDescription>
                                </Alert>

                                <Select
                                    name="accessLevel"
                                    options={memberAccessLevelsOptions}
                                    placeholder="Select access level..."
                                    label="Access Level"
                                    onlyValue
                                />

                                {selectedAccessLevel === 'admin' && (
                                    <Alert className="border-destructive/40 bg-destructive/5">
                                        <Crown className="h-4 w-4 text-destructive" />
                                        <AlertDescription className="ml-2 text-sm">
                                            <span className="font-semibold">
                                                Admin Access:
                                            </span>{' '}
                                            This user will have full system
                                            access and can manage all
                                            departments automatically.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedAccessLevel === 'assessor' && (
                                    <Alert className="border-secondaryNew/40 bg-secondaryNew/5">
                                        <GraduationCap className="h-4 w-4 text-secondaryNew" />
                                        <AlertDescription className="ml-2 text-sm">
                                            <span className="font-semibold">
                                                Assessor Access:
                                            </span>{' '}
                                            This user will only have access to
                                            the Assessment department.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <Separator />

                            {/* Departments */}
                            {selectedAccessLevel !== 'admin' && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                            3
                                        </span>
                                        Assign Departments
                                    </h3>

                                    <Alert className="border-primaryNew/40 bg-primaryNew/5">
                                        <Briefcase className="h-4 w-4 text-secondaryNew" />
                                        <AlertDescription className="ml-2 text-sm">
                                            Choose which parts of the portal
                                            this person can access. You can
                                            select multiple departments.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-3">
                                        {AVAILABLE_TEAMS.map((team) => (
                                            <div
                                                key={team}
                                                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-gray-100 transition-colors"
                                            >
                                                <Checkbox
                                                    checked={selectedDepartments.includes(
                                                        team
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleDepartment(team)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`team-${team}`}
                                                    className="text-sm font-medium cursor-pointer flex-1"
                                                >
                                                    {team}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Tags */}
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2 text-lg">
                                    <span className="h-6 w-6 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm">
                                        {selectedAccessLevel === 'admin'
                                            ? '3'
                                            : '4'}
                                    </span>
                                    Support Tags (Optional)
                                </h3>

                                <Alert className="border-orange-400/40 bg-orange-500/5">
                                    <Info className="h-4 w-4 text-accent" />
                                    <AlertDescription className="ml-2 text-sm space-y-2">
                                        <p className="font-semibold">
                                            About Support Tags:
                                        </p>
                                        <p>
                                            Tags enable automatic ticket
                                            routing. When assigned:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                            <li>
                                                Support tickets are
                                                automatically distributed to
                                                tagged members
                                            </li>
                                            <li>
                                                Work is shared equally among
                                                team members with the same tag
                                            </li>
                                            <li>
                                                Only use for members who handle
                                                support responsibilities
                                            </li>
                                        </ul>
                                        <p className="text-xs italic">
                                            Leave empty if this member doesn't
                                            need automated ticket assignment.
                                        </p>
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-2 gap-3">
                                    {TEAM_TAGS.map((tag) => (
                                        <div
                                            key={tag}
                                            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-gray-100 transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedTags.includes(
                                                    tag
                                                )}
                                                onCheckedChange={() =>
                                                    toggleTag(tag)
                                                }
                                            />
                                            <Label
                                                htmlFor={`member-tag-${tag}`}
                                                className="text-sm font-medium cursor-pointer flex items-center gap-2 flex-1 capitalize"
                                            >
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
                                outline
                                onClick={() => setAddMemberOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-linear-to-r!` from-primaryNew to-secondaryNew gap-2"
                                submit
                                variant="primaryNew"
                            >
                                <Send className="h-4 w-4" />
                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
