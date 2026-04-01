import { Button } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui/dialog'
import { FileText, Eye, Sparkles, Archive } from 'lucide-react'
import React, { useState } from 'react'
import { AssessmentList } from './AssessmentList'
import { AddAssessmentModal } from './AddAssessmentModal'
import { ConfigTabs, TabConfig } from '@components/ConfigTabs/ConfigTabs'
import { UserStatus } from '@types'

interface ViewAssessmentsModalProps {
    course: any
}

export const ViewAssessmentsModal = ({ course }: ViewAssessmentsModalProps) => {
    const [open, setOpen] = useState(false)

    const [activeTab, setActiveTab] = useState(UserStatus.Approved)

    const tabs: TabConfig[] = [
        {
            value: UserStatus.Approved,
            label: 'Active Tools',
            icon: FileText,
            component: (props: any) => (
                <AssessmentList {...props} status={UserStatus.Approved} />
            ),
        },
        {
            value: UserStatus.Archived,
            label: 'Archived Tools',
            icon: Archive,
            component: (props: any) => (
                <AssessmentList {...props} status={UserStatus.Archived} />
            ),
        },
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="primaryNew"
                    Icon={Eye}
                    text="View Assessment Tools"
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl **:data-[slot=dialog-close]:text-white">
                <DialogHeader className="gap-0! px-6 py-3.5 bg-linear-to-br from-primaryNew to-primaryNew/80 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileText className="h-20 w-20" />
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-white/80" />
                        Assessment Tools
                    </DialogTitle>
                    <p className="text-white/70 mt-1 text-sm">
                        Course:{' '}
                        <span className="font-semibold text-white">
                            {course?.title}
                        </span>
                    </p>
                </DialogHeader>

                <div className="px-8 py-3 pt-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-lg">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">
                                Management Hub
                            </span>
                        </div>
                        <AddAssessmentModal course={course} />
                    </div>

                    <div className="mt-6">
                        <ConfigTabs
                            tabs={tabs}
                            props={{ courseId: course?.id }}
                            defaultValue={UserStatus.Approved}
                            tabsClasses="p-1!"
                            tabsTriggerClasses="p-1!"
                            onValueChange={(val: any) => setActiveTab(val)}
                        />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            variant="primary"
                            text="Close View"
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
