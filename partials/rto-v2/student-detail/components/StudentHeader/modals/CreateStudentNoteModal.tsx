import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, Maximize2 } from 'lucide-react'
import { CreateStudentNote } from '@partials/common/Notes/forms/CreateStudentNote'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { inputRichTextEditorErrorMessage, Portal } from '@components'

interface CreateStudentNoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: number
    receiverId: number
}

export const CreateStudentNoteModal = ({
    open,
    onOpenChange,
    studentId,
    receiverId,
}: CreateStudentNoteModalProps) => {
    const [isMinimized, setIsMinimized] = useState(false)

    // Lifted validation schema to match CreateStudentNote
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        body: Yup.mixed().test('Message', 'Must Provide Message', (value) =>
            inputRichTextEditorErrorMessage(value)
        ),
    })

    // This useForm lives as long as the component is mounted (while 'open' is true in parent)
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: '',
            body: '',
            isPinned: false,
        }
    })

    if (!open) return null

    const handleClose = () => {
        onOpenChange(false)
        setIsMinimized(false)
        methods.reset()
    }

    const handleMinimize = () => {
        setIsMinimized(true)
    }

    const handleMaximize = () => {
        setIsMinimized(false)
    }

    return (
        <>
            <Dialog
                open={open && !isMinimized}
                onOpenChange={(val) => {
                    if (!val) {
                        // Instead of closing, minimize on click-away
                        handleMinimize()
                    }
                }}
            >
                <DialogContent
                    className="max-w-4xl! p-0 overflow-hidden bg-white border-none shadow-premium-2xl"
                    showCloseButton={false} // We have our own X in CreateStudentNote
                >
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Add Student Note</DialogTitle>
                        <DialogDescription>
                            Create a new note for this student.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[85vh]">
                        <div className="p-1">
                            <CreateStudentNote
                                studentId={studentId}
                                receiverId={receiverId}
                                onCancel={handleClose}
                                onMinimize={handleMinimize}
                                externalMethods={methods}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Portal>
                <AnimatePresence>
                    {isMinimized && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="fixed bottom-6 right-[50px] z-9999"
                        >
                            <button
                                onClick={handleMaximize}
                                className="bg-[#044866] text-white pl-4 pr-6 py-3 rounded-full shadow-premium-lg hover:shadow-premium-xl hover:scale-105 transition-all flex items-center gap-3 group border-2 border-white/20"
                            >
                                <div className="bg-white/20 p-2 rounded-full">
                                    <StickyNote className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 leading-tight">
                                        Minimized
                                    </span>
                                    <span className="text-sm font-semibold text-white leading-tight">
                                        Restore Student Note
                                    </span>
                                </div>
                                <Maximize2 className="w-4 h-4 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Portal>
        </>
    )
}
