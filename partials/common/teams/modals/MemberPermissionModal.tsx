import {
    Avatar,
    AvatarFallback,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui'
import { Alert, AlertDescription } from '@components/ui/alert'
import {
    Briefcase,
    CheckCircle2,
    Crown,
    Edit,
    Eye,
    GraduationCap,
    Info,
    Save,
    Shield,
    Tag,
} from 'lucide-react'
import React, { useState } from 'react'
import { Checkbox } from '@components/ui/checkbox'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { Badge } from '@components/ui/badge'
import { Button } from '@components'
import { AVAILABLE_TEAMS, TEAM_TAGS } from '../teams-tabs'

const AVAILABLE_SECTORS = [
    'Healthcare',
    'Technology',
    'Construction',
    'Hospitality',
    'Retail',
    'Manufacturing',
    'Education',
    'Finance',
    'Agriculture',
    'Automotive',
]

const AVAILABLE_COURSES = [
    'Certificate III in Individual Support',
    'Certificate IV in Ageing Support',
    'Diploma of Nursing',
    'Certificate III in Commercial Cookery',
    'Certificate IV in Information Technology',
    'Diploma of Business',
    'Certificate III in Carpentry',
    'Certificate IV in Building and Construction',
    'Diploma of Early Childhood Education',
    'Certificate III in Retail Operations',
]

export const MemberPermissionModal = ({
    editMemberOpen,
    setEditMemberOpen,
}: any) => {
    const [editingMember, setEditingMember] = useState<any | null>(null)
    const [editMemberTeams, setEditMemberTeams] = useState<string[]>([])
    const [editMemberTags, setEditMemberTags] = useState<string[]>([])
    const [editMemberSectors, setEditMemberSectors] = useState<string[]>([])
    const [editMemberCourses, setEditMemberCourses] = useState<string[]>([])
    const toggleEditTag = (tag: string) => {
        setEditMemberTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const toggleEditSector = (sector: string) => {
        setEditMemberSectors((prev) =>
            prev.includes(sector)
                ? prev.filter((t) => t !== sector)
                : [...prev, sector]
        )
    }

    const toggleEditCourse = (course: string) => {
        setEditMemberCourses((prev) =>
            prev.includes(course)
                ? prev.filter((t) => t !== course)
                : [...prev, course]
        )
    }
    const toggleEditTeam = (team: string) => {
        setEditMemberTeams((prev) =>
            prev.includes(team)
                ? prev.filter((t) => t !== team)
                : [...prev, team]
        )
    }
    const getAccessLevelBadge = (level: string) => {
        switch (level) {
            case 'admin':
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        <Crown className="h-3 w-3 mr-1" />
                        RTO-Admin
                    </Badge>
                )
            case 'coordinator':
                return (
                    <Badge className="bg-primaryNew/10 text-white border-primaryNew/20">
                        <Shield className="h-3 w-3 mr-1" />
                        Coordinator
                    </Badge>
                )
            case 'assessor':
                return (
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Assessor
                    </Badge>
                )
            case 'viewer':
                return (
                    <Badge className="bg-muted text-muted-foreground border-border">
                        <Eye className="h-3 w-3 mr-1" />
                        Viewer
                    </Badge>
                )
            default:
                return null
        }
    }
    return (
        <>
            <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-3">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primaryNew to-primaryNew flex items-center justify-center">
                                <Edit className="h-4 w-4 text-white" />
                            </div>
                            Edit Member - John Doe
                            {/* {editingMember?.name} */}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Update team assignments, tags, sectors, and course
                            permissions
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        {/* Member Info */}
                        <div className="p-3 rounded-lg bg-gray-100 border border-border">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-primaryNew/20">
                                    <AvatarFallback className="bg-linear-to-br from-primaryNew to-primaryNew text-white text-sm">
                                        {/* {editingMember &&
                                            getInitials(editingMember.name)} */}
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">
                                        {/* {editingMember?.name} */}
                                        John Doe
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {/* {editingMember?.email} */}
                                        johndoe@example.com
                                    </p>
                                    <div className="mt-0.5">
                                        {editingMember &&
                                            getAccessLevelBadge(
                                                editingMember.accessLevel
                                            )}
                                        access level
                                    </div>
                                </div>
                            </div>
                        </div>

                        {editingMember?.accessLevel !== 'admin' && (
                            <>
                                {/* Teams Assignment */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-1.5 text-base">
                                        <Briefcase className="h-4 w-4 text-primaryNew" />
                                        Team Assignments
                                    </h3>

                                    <Alert className="border-primaryNew/40 bg-primaryNew/5 py-2">
                                        <Info className="h-3.5 w-3.5 text-primaryNew" />
                                        <AlertDescription className="ml-2 text-xs">
                                            Select which teams this member can
                                            access. They will only see content
                                            and students from their assigned
                                            teams.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-2">
                                        {AVAILABLE_TEAMS.map((team: any) => (
                                            <div
                                                key={team}
                                                className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                            >
                                                <Checkbox
                                                    id={`edit-team-${team}`}
                                                    checked={editMemberTeams.includes(
                                                        team
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleEditTeam(team)
                                                    }
                                                    className="h-4 w-4"
                                                />
                                                <Label
                                                    htmlFor={`edit-team-${team}`}
                                                    className="text-xs font-medium cursor-pointer flex-1"
                                                >
                                                    {team}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    {editMemberTeams?.length === 0 && (
                                        <Alert className="border-warning/40 bg-warning/5 py-2">
                                            <Info className="h-3.5 w-3.5 text-warning" />
                                            <AlertDescription className="ml-2 text-xs">
                                                <strong>Warning:</strong> This
                                                member has no teams assigned.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <Separator className="my-3" />
                            </>
                        )}

                        {/* Tag Permissions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-1.5 text-base">
                                <Tag className="h-4 w-4 text-accent" />
                                Tag Permissions
                            </h3>

                            <div className="grid grid-cols-1 gap-2">
                                {TEAM_TAGS.map((tag: any) => (
                                    <div
                                        key={tag}
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Label
                                                htmlFor={`edit-tag-${tag}`}
                                                className="text-xs font-medium cursor-pointer"
                                            >
                                                {tag}
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`edit-tag-${tag}`}
                                                checked={editMemberTags.includes(
                                                    tag
                                                )}
                                                onCheckedChange={() =>
                                                    toggleEditTag(tag)
                                                }
                                                className="h-4 w-4"
                                            />
                                            <Badge
                                                variant={
                                                    editMemberTags.includes(tag)
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={`text-xs ${
                                                    editMemberTags.includes(tag)
                                                        ? 'bg-success text-white'
                                                        : ''
                                                }`}
                                            >
                                                {editMemberTags.includes(tag)
                                                    ? 'ON'
                                                    : 'OFF'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {editMemberTags.length > 0 && (
                                <Alert className="border-success/40 bg-success/5 py-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                    <AlertDescription className="ml-2 text-xs">
                                        <strong>
                                            Active Tags ({editMemberTags.length}
                                            ):
                                        </strong>{' '}
                                        {editMemberTags.join(', ')}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sector Permissions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-1.5 text-base">
                                <Briefcase className="h-4 w-4 text-secondary" />
                                Sector Permissions
                            </h3>

                            <div className="grid grid-cols-2 gap-2">
                                {AVAILABLE_SECTORS.map((sector) => (
                                    <div
                                        key={sector}
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2 flex-1">
                                            <Label
                                                htmlFor={`edit-sector-${sector}`}
                                                className="text-xs font-medium cursor-pointer"
                                            >
                                                {sector}
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`edit-sector-${sector}`}
                                                checked={editMemberSectors.includes(
                                                    sector
                                                )}
                                                onCheckedChange={() =>
                                                    toggleEditSector(sector)
                                                }
                                                className="h-4 w-4"
                                            />
                                            <Badge
                                                variant={
                                                    editMemberSectors.includes(
                                                        sector
                                                    )
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={`text-xs ${
                                                    editMemberSectors.includes(
                                                        sector
                                                    )
                                                        ? 'bg-success text-white'
                                                        : ''
                                                }`}
                                            >
                                                {editMemberSectors.includes(
                                                    sector
                                                )
                                                    ? 'ON'
                                                    : 'OFF'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {editMemberSectors.length > 0 && (
                                <Alert className="border-success/40 bg-success/5 py-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                    <AlertDescription className="ml-2 text-xs">
                                        <strong>
                                            Active Sectors (
                                            {editMemberSectors.length}):
                                        </strong>{' '}
                                        {editMemberSectors.join(', ')}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Course Permissions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-1.5 text-base">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Course Permissions
                            </h3>

                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                                {AVAILABLE_COURSES.map((course) => (
                                    <div
                                        key={course}
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2 flex-1">
                                            <Label
                                                htmlFor={`edit-course-${course}`}
                                                className="text-xs font-medium cursor-pointer"
                                            >
                                                {course}
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`edit-course-${course}`}
                                                checked={editMemberCourses.includes(
                                                    course
                                                )}
                                                onCheckedChange={() =>
                                                    toggleEditCourse(course)
                                                }
                                                className="h-4 w-4"
                                            />
                                            <Badge
                                                variant={
                                                    editMemberCourses.includes(
                                                        course
                                                    )
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={`text-xs ${
                                                    editMemberCourses.includes(
                                                        course
                                                    )
                                                        ? 'bg-success text-white'
                                                        : ''
                                                }`}
                                            >
                                                {editMemberCourses.includes(
                                                    course
                                                )
                                                    ? 'ON'
                                                    : 'OFF'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {editMemberCourses.length > 0 && (
                                <Alert className="border-success/40 bg-success/5 py-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                    <AlertDescription className="ml-2 text-xs">
                                        <strong>
                                            Active Courses (
                                            {editMemberCourses.length}):
                                        </strong>{' '}
                                        {editMemberCourses.join(', ')}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="secondary"
                            outline
                            onClick={() => setEditMemberOpen(false)}
                            className="h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-linear-to-r from-primaryNew to-primaryNew gap-1.5 h-9"
                            variant="primaryNew"
                            // onClick={handleSaveEdit}
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
