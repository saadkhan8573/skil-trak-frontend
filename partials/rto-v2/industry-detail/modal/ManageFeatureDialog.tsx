import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui'
import { Button, TextInput } from '@components'
import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Separator } from '@components/ui/separator'
import { ScrollArea } from '@components/ui/scroll-area'

interface Feature {
    name: string
    description: string
    enabled: boolean
    cost: string
}

export const ManageFeatureDialog = () => {
    const [open, setOpen] = useState(false)
    const [editingFeatures, setEditingFeatures] = useState<Feature[]>([
        {
            name: 'Conditional MOU',
            enabled: true,
            description:
                'Conditional agreement confirming eligibility and future placement intent',
            cost: '$90',
        },
        {
            name: 'Industry Consultations',
            enabled: true,
            description: 'Curriculum-based discussions (online or in-person)',
            cost: '$50–$80/hr / $120–$150/hr',
        },
        {
            name: 'Simulation Labs',
            enabled: true,
            description: 'Industry labs for RTO practical sessions',
            cost: '$50–$80/hr / Up to $500',
        },
        {
            name: 'Seminars',
            enabled: false,
            description: 'On-campus professional presentations',
            cost: '$100/hr / $120–$150/hr',
        },
        {
            name: 'Webinars',
            enabled: true,
            description: 'Online seminars with or without prepared content',
            cost: '$40–$50/hr / $80–$100/hr',
        },
        {
            name: 'Podcasts',
            enabled: false,
            description: 'Recorded conversations on course and industry topics',
            cost: "Speaker's rate",
        },
    ])

    const updateFeatureStatus = (index: number) => {
        setEditingFeatures((prev) =>
            prev.map((feature, i) =>
                i === index
                    ? { ...feature, enabled: !feature.enabled }
                    : feature
            )
        )
    }

    const updateFeatureCost = (index: number, cost: string) => {
        setEditingFeatures((prev) =>
            prev.map((feature, i) =>
                i === index ? { ...feature, cost } : feature
            )
        )
    }

    const handleSaveFeatures = () => {
        // TODO: Implement save logic
        console.log('Saving features:', editingFeatures)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="mt-3 w-full py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-all border border-white/30 h-auto"
                    onClick={() => setOpen(true)}
                >
                    Manage Features
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-[#044866]">
                        Manage Premium Features
                    </DialogTitle>
                    <DialogDescription>
                        Update pricing and availability for each premium feature
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(85vh-180px)] pr-4">
                    <div className="space-y-4 py-4">
                        {editingFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-lg p-4 border border-[#044866]/10"
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            updateFeatureStatus(index)
                                        }
                                        className="p-0 h-auto hover:bg-transparent"
                                    >
                                        <CheckCircle
                                            className={`w-5 h-5 transition-all ${feature.enabled
                                                    ? 'text-[#10B981]'
                                                    : 'text-gray-300'
                                                }`}
                                            fill={
                                                feature.enabled
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                        />
                                    </Button>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#044866] mb-1">
                                            {feature.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-8">
                                    <TextInput
                                        label="Pricing"
                                        name={`cost-${index}`}
                                        value={feature.cost}
                                        onChange={(e: any) =>
                                            updateFeatureCost(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., $150/month"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveFeatures}
                        className="flex-1 bg-[#044866] hover:bg-[#0D5468] text-white"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
