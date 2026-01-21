import {
    Badge,
    Button,
    Card,
    GlobalModal,
    ShowErrorNotifications,
    TextArea,
    Typography,
} from '@components'
import { CreateStudentNote } from '@partials/common/Notes/forms'
import { CommonApi } from '@queries'
import { Student } from '@types'
import { getUserCredentials, isBrowser } from '@utils'
import {
    FileText,
    Loader2,
    Send,
    Sparkles,
    Ticket
} from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { searchAiUrls } from '../urls'

interface AIQuestionPanelProps {
    student: Student
}

interface Message {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
}

const suggestedQuestions = [
    "What's the current status of this student's placement?",
    'Are there any blockers or issues I should know about?',
    'What are the next actions I need to take?',
    'When is their next appointment or shift?',
    'Has the student signed their placement agreement?',
    'Show me recent communications with this student',
]

export function AIQuestionPanel({ student }: AIQuestionPanelProps) {
    const [question, setQuestion] = useState('')
    const [modal, setModal] = useState<ReactElement | null>(null)
    const [messages, setMessages] = useState<Message[]>([])

    const [resetKey, setResetKey] = useState(0)

    const router = useRouter()

    const [aiAssisstant, aiAssisstantResult] =
        CommonApi.AiAssistant.askAiAboutStudent()

    const role = getUserCredentials()?.role
    const urls = searchAiUrls(role!, student?.id)

    const onHandleScroll = (i: string) => {
        if (isBrowser()) {
            const parentDiv = document.getElementById('parent-div') // Replace with actual ID

            if (parentDiv) {
                const detailItem = document.getElementById(`detail-item-${i}`)
                if (detailItem) {
                    const detailTop = detailItem.offsetTop // Get detail item's position within the div
                    parentDiv.scrollTo({
                        top: detailTop,
                        behavior: 'smooth',
                    }) // Scroll parent div to reveal the detail item
                }
            }
        }
    }

    useEffect(() => {
        onHandleScroll(messages?.[messages?.length - 1]?.id)
    }, [messages])

    const onSubmit = async (q: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: q,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        // onHandleScroll(userMessage?.id)
        setQuestion('')

        // Call AI
        const response: any = await aiAssisstant({
            studentId: student?.id,
            question: q,
        })

        // Add AI response
        if (response?.data) {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: response.data.response,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, aiMessage])
            setResetKey((prev) => prev + 1) // Force TextArea to remount
            // onHandleScroll(aiMessage?.id)
            // setTimeout(() => {
            //     scrollToBottom()
            // }, 200)
        }
    }

    const handleSubmit = () => {
        if (question.trim() && !aiAssisstantResult.isLoading) {
            onSubmit(question)
        }
    }


    const handleSuggestedQuestion = (q: string) => {
        onSubmit(q)
    }

    const onCancel = () => setModal(null)

    const onCreateTicket = () => {
        router.push(urls?.ticket + "")
    }

    const onAddNote = () => {
        setModal(
            <GlobalModal className="!overflow-hidden">
                <div className="!h-[88vh] !overflow-auto !custom-scrollbar">
                    <CreateStudentNote
                        studentId={student?.id}
                        receiverId={Number(student?.user?.id)}
                        onCancel={onCancel}
                    />
                </div>
            </GlobalModal>
        )
    }

    const actionButtons = [
        {
            id: 'create-ticket',
            icon: Ticket,
            label: 'Create Ticket',
            onClick: onCreateTicket,
        },
        {
            id: 'add-note',
            icon: FileText,
            label: 'Add Note',
            onClick: onAddNote,
        },
    ]

    return (
        <>
            {modal}
            <ShowErrorNotifications result={aiAssisstantResult} />
            <Card
                noPadding
                className="overflow-hidden !rounded-md border-2 shadow-xl h-full flex flex-col"
            >
                {/* Header */}
                <div className="p-2.5 border-b bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primaryNew/10 p-2">
                            <Sparkles className="h-4 w-4 text-primaryNew" />
                        </div>
                        <div>
                            <Typography variant="subtitle" semibold>
                                Ask AI Bunny This Student
                            </Typography>
                            <Typography variant="small" color="text-gray-700">
                                Get instant insights about placement status,
                                blockers, and next actions
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div
                    // ref={chatContainerRef}
                    id={'parent-div'}
                    className="max-h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                    {messages.length === 0 ? (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Try asking:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((q, idx) => (
                                    <Badge
                                        key={idx}
                                        text={q}
                                        variant="primaryNew"
                                        outline
                                        onClick={() =>
                                            handleSuggestedQuestion(q)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    id={`detail-item-${msg?.id}`}
                                    className={`flex ${msg.type === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                                            ? 'bg-primaryNew text-white'
                                            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200'
                                            }`}
                                    >
                                        {msg.type === 'ai' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="h-4 w-4 text-primaryNew" />
                                                <span className="text-xs font-semibold text-primaryNew">
                                                    AI Bunny
                                                </span>
                                            </div>
                                        )}
                                        <p className="whitespace-pre-line text-sm leading-relaxed">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {aiAssisstantResult.isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primaryNew" />
                                            <span className="text-sm text-gray-600">
                                                Bunny AI is thinking...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* <div ref={messagesEndRef} /> */}
                        </>
                    )}
                </div>

                {/* Quick Actions (shown when there are messages) */}
                {messages.length > 0 && (
                    <div className="px-4 pb-2">
                        <div className="flex gap-2">
                            {actionButtons.map((button) => {
                                const Icon = button.icon
                                return (
                                    <Button
                                        key={button.id}
                                        variant="secondary"
                                        className="flex items-center gap-2"
                                        onClick={button.onClick}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="text-xs">
                                            {button.label}
                                        </span>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="border-t bg-gray-50 p-3">
                    <div className="flex gap-2">
                        <TextArea
                            key={resetKey}
                            name="message"
                            value={question}
                            onChange={(e: any) => setQuestion(e.target.value)}
                            // onKeyPress={handleKeyPress}
                            placeholder="Type your question here... (Press Enter to send)"
                            rows={2}
                            className="flex-1"
                            showError={false}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !question.trim() || aiAssisstantResult.isLoading
                            }
                            variant="info"
                            className="self-end"
                        >
                            {aiAssisstantResult?.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    )
}
