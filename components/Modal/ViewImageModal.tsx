'use client'

import { Button, Typography } from '@components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { FileImage, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface ViewImageModalProps {
    open: boolean
    fileUrl: string
    onOpenChange: (open: boolean) => void
    title?: string
    subtitle?: string
}

export function ViewImageModal({
    open,
    fileUrl,
    onOpenChange,
    title = 'Image Preview',
    subtitle = 'Document Review',
}: ViewImageModalProps) {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
    const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl! p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="w-full bg-primaryNew p-6 text-white sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
                            <FileImage className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold tracking-tight text-white mb-0.5">
                                {title}
                            </DialogTitle>
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg p-1 shadow-sm">
                            <Button
                                mini
                                Icon={ZoomOut}
                                variant="action"
                                onClick={handleZoomOut}
                                title="Zoom Out"
                                disabled={zoom <= 0.5}
                            />
                            <span className="text-xs font-bold text-slate-400 w-12 text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <Button
                                mini
                                Icon={ZoomIn}
                                variant="action"
                                onClick={handleZoomIn}
                                title="Zoom In"
                                disabled={zoom >= 3}
                            />
                        </div>

                        <Button
                            onClick={handleRotate}
                            Icon={RotateCw}
                            variant="action"
                            text="Rotate"
                            iconSize={16}
                        />

                        <Button
                            onClick={() => window.open(fileUrl, '_blank')}
                            Icon={Download}
                            variant="info"
                            text="Download"
                            iconSize={16}
                        />
                    </div>
                </div>

                <div className="bg-slate-200/50 flex items-center justify-center overflow-auto max-h-[70vh] p-8 custom-scrollbar">
                    <div
                        className="transition-all duration-200 ease-in-out shadow-2xl bg-white p-2 rounded-sm"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    >
                        <div
                            className="relative"
                            style={{
                                width: '600px', // Fixed base width for Next Image container
                                height: '400px', // Fixed base height for Next Image container
                                maxWidth: '100%',
                            }}
                        >
                            <Image
                                src={fileUrl}
                                alt={title}
                                fill
                                className="object-contain block"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
