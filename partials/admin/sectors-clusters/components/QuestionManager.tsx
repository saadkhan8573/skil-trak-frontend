import {
    ActionModal,
    Badge,
    Button,
    Card,
    NoData,
    ShowErrorNotifications,
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
import { useNotification } from '@hooks'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { AddSectorQuestionModal } from '../modals/AddSectorQuestionModal'
import { EditSectorQuestionModal } from '../modals/EditSectorQuestionModal'
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

const DEFAULT_QUESTIONS = [
    {
        id: 'default-1',
        title: 'Direct Support Environment',
        question:
            'Do you provide direct client support (personal care, daily living, community support) in a residential, community, home or centre-based setting?',
        example: '',
        isDefault: true,
    },
    {
        id: 'default-2',
        title: 'Supervision',
        question:
            'Will the student be supervised by a qualified worker (same qualification or higher) or experienced support staff?',
        example: '',
        isDefault: true,
    },
    {
        id: 'default-3',
        title: 'Equipment & Resources',
        question: 'Do you have appropriate equipment and systems in place?',
        example:
            'Examples: hoists, mobility aids, transfer equipment, PPE, care plans, incident reporting, documentation systems',
        isDefault: true,
    },
]

export const QuestionManager = ({
    onUpdateQuestions,
}: QuestionManagerProps) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null
    )
    const [deletingQuestion, setDeletingQuestion] = useState<any>(null)
    const router = useRouter()
    const secId = router.query.id
    const {
        data: questions,
        isLoading,
        isError,
    } = AdminApi.SectorClusters.useSectorClusterQuestions(Number(secId), {
        skip: !secId,
    })
    const [deleteQuestion, deleteQuestionResult] =
        AdminApi.SectorClusters.useDeleteSectorQuestion()
    const { notification } = useNotification()

    useEffect(() => {
        if (deleteQuestionResult.isSuccess) {
            notification.success({
                title: 'Question Deleted',
                description: 'Question has been deleted successfully',
            })
            setDeletingQuestion(null)
        }
    }, [deleteQuestionResult.isSuccess])

    const handleDeleteQuestion = (question: any) => {
        setDeletingQuestion(question)
    }

    const onConfirmDelete = async (question: any) => {
        await deleteQuestion(question.id)
    }

    const openEditDialog = (question: Question) => {
        setEditingQuestion(question)
        setIsEditDialogOpen(true)
    }

    const allQuestions = questions || []

    return (
        <>
            <ShowErrorNotifications result={deleteQuestionResult} />
            <Card className="space-y-4">
                {deletingQuestion && (
                    <ActionModal
                        Icon={FaTrash}
                        variant="error"
                        title="Are you sure!"
                        description={`You are about to delete "${deletingQuestion.title}". Do you wish to continue?`}
                        onConfirm={onConfirmDelete}
                        onCancel={() => setDeletingQuestion(null)}
                        actionObject={deletingQuestion}
                        loading={deleteQuestionResult.isLoading}
                    />
                )}
                <div>
                    <Typography variant="label">
                        Sector Prerequisites
                    </Typography>
                    <Typography variant="small" color="text-gray-500">
                        Configure the questions that must be answered before
                        this sector can be unlocked
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
                        />
                        <EditSectorQuestionModal
                            isEditDialogOpen={isEditDialogOpen}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            editValues={editingQuestion}
                        />
                    </div>

                    <div className="space-y-3">
                        {isError && <NoData isError />}
                        {isLoading ? (
                            <PulseLoader color="#2563eb" size={10} margin={4} />
                        ) : allQuestions?.length > 0 ? (
                            allQuestions?.map((question: any, index: any) => (
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
                                            {!question?.isDefault && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div
                                                        onClick={() =>
                                                            openEditDialog(
                                                                question
                                                            )
                                                        }
                                                        className="border rounded-md p-2 cursor-pointer"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </div>

                                                    <div
                                                        onClick={() =>
                                                            handleDeleteQuestion(
                                                                question
                                                            )
                                                        }
                                                        className="border rounded-md p-2 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </div>
                                                </div>
                                            )}
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
        </>
    )
}
