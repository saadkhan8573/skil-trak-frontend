import {
    Badge,
    Button,
    Card,
    NoData,
    TextArea,
    TextInput,
    Typography,
} from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Label,
} from '@components/ui'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AddSectorQuestionModal } from '../modals/AddSectorQuestionModal'
import { useRouter } from 'next/router'
import { AdminApi } from '@queries'
import { PulseLoader } from 'react-spinners'

export interface Question {
    id: string
    title: string
    question: string
    examples?: string
    type: 'default' | 'custom'
}

interface QuestionManagerProps {
    onUpdateQuestions: (questions: Question[]) => void
}

export const QuestionManager = ({
    onUpdateQuestions,
}: QuestionManagerProps) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null
    )
    const router = useRouter()
    const secId = router.query.id
    const {
        data: questions,
        isLoading,
        isError,
    } = AdminApi.SectorClusters.useSectorClusterQuestions(Number(secId), {
        skip: !secId,
    })

    const handleDeleteQuestion = (id: string) => {
        onUpdateQuestions(questions.filter((q: any) => q.id !== id))
    }
    const openEditDialog = (question: Question) => {
        setIsEdit(true)
        setEditingQuestion(question)
        setIsAddDialogOpen(true)
    }

    return (
        <Card className="space-y-4">
            <div>
                <Typography variant="label">Sector Prerequisites</Typography>
                <Typography variant="small" color="text-gray-500">
                    Configure the questions that must be answered before this
                    sector can be unlocked
                </Typography>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Typography variant="subtitle">
                        Prerequisite Questions
                    </Typography>
                    <AddSectorQuestionModal
                        isAddDialogOpen={isAddDialogOpen}
                        setIsAddDialogOpen={setIsAddDialogOpen}
                        isEdit={isEdit}
                        editValues={editingQuestion}
                    />
                </div>

                <div className="space-y-3">
                    {isError && <NoData isError />}
                    {isLoading ? (
                        <PulseLoader color="#2563eb" size={10} margin={4} />
                    ) : questions?.length > 0 ? (
                        questions?.map((question: any, index: any) => (
                            <Card
                                key={question.id}
                                className="border-l-4 border-l-blue-500"
                            >
                                <div className="pt-4">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* LEFT */}
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    {index + 1}.{' '}
                                                    {question.title}
                                                </span>
                                                <Badge
                                                    variant={
                                                        question?.isDefault
                                                            ? 'secondary'
                                                            : 'info'
                                                    }
                                                >
                                                    {question?.isDefault
                                                        ? 'Default'
                                                        : 'Custom'}
                                                </Badge>
                                            </div>

                                            <p className="text-gray-700 break-all">
                                                {question?.question}
                                            </p>

                                            {question?.example && (
                                                <p className="text-sm text-gray-600 italic break-words">
                                                    {question?.example}
                                                </p>
                                            )}
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div
                                                onClick={() =>
                                                    openEditDialog(question)
                                                }
                                                className="border rounded-md p-2 cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </div>

                                            {!question?.isDefault && (
                                                <div
                                                    onClick={() =>
                                                        handleDeleteQuestion(
                                                            question.id
                                                        )
                                                    }
                                                    className="border rounded-md p-2 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        !isError && <NoData text="No question added yet" />
                    )}
                </div>
            </div>
        </Card>
    )
}
