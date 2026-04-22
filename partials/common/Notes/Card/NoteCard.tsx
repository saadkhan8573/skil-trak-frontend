import {
    ActionButton,
    AuthorizedUserComponent,
    ShowErrorNotifications,
    Typography,
    useWorldwideStudentDataRestriction,
} from '@components'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { Note as NoteType } from '@types'
import { useEffect, useState } from 'react'

import { NotesTemplateType } from '@partials/admin/noteTemplates/enum'
import moment from 'moment'
import { FaTrash } from 'react-icons/fa'
import { RiDeleteBinLine } from 'react-icons/ri'
import { TiPin } from 'react-icons/ti'
import { PuffLoader } from 'react-spinners'
import { HtmlToPlainText, playAudioSound, stopAudioSound } from '@utils'
import { TextToSpeech } from '@pages/api/openai/textToSpeech'
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2'
import { useAppSelector } from '@redux'

export const NoteCard = ({ note }: { note: NoteType | any }) => {
    const { notification } = useNotification()

    const [audioLoading, setAudioLoading] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const rtoUserId = useAppSelector((state) => state.rto?.rtoDetail?.user?.id)

    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
        }
    }, [audioUrl])

    const [statusChange, statusChangeResult] = CommonApi.Notes.useStatusChange()
    const togglePin = async () => {
        const res: any = await statusChange(note.id)
        if (res?.data) {
            notification.success({
                title: `Note ${res?.data?.isPinned ? 'Pinned' : 'Un-Pinned'}`,
                description: `Note ${
                    res?.data?.isPinned ? 'Pinned' : 'Un-Pinned'
                } Successfully`,
                position: 'topright',
            })
        }
    }

    const [isDeleting, setDeleting] = useState(false)
    const [remove, removeResult] = CommonApi.Notes.useRemove()
    const onDeleteClick = async () => {
        await remove(note.id)
    }

    useEffect(() => {
        if (removeResult.isSuccess) {
            notification.success({
                title: 'Note Deleted',
                description: 'Note has been deleted on your request',
            })
        }
    }, [removeResult])

    const handleSubmit = async () => {
        if (audioUrl && isPlaying) {
            setIsPlaying(false)
            stopAudioSound(audioUrl)
            return
        } else if (audioUrl && !isPlaying) {
            playAudioSound(audioUrl)
            setIsPlaying(true)
            return
        }
        const text = HtmlToPlainText(note?.body ?? note?.message)
        setAudioLoading(true)

        try {
            const response = await TextToSpeech({
                text,
            })
            setAudioLoading(false)

            if (!response.ok) {
                const { error }: { error: string } = await response.json()
                throw new Error(error)
            }

            const blob: Blob = await response.blob()
            const url: string = URL.createObjectURL(blob)
            setAudioUrl(url)

            const audio = playAudioSound(url)
            if (audio) {
                setIsPlaying(true)

                // Listen for audio end to update state
                audio.addEventListener('ended', () => {
                    setIsPlaying(false)
                })

                // Listen for audio pause to update state
                audio.addEventListener('pause', () => {
                    setIsPlaying(false)
                })
            }
        } catch (err: any) {
        } finally {
            setAudioLoading(false)
        }
    }

    const stopAudio = () => {
        if (audioUrl) {
            stopAudioSound(audioUrl)
            setIsPlaying(false)
        }
    }

    const author = note?.author ?? note?.assignedTo

    const authorName =
        author?.role === UserRoles.STUDENT && !hasPermission
            ? 'Student'
            : author?.name
    return (
        <>
            <ShowErrorNotifications result={removeResult} />
            <ShowErrorNotifications
                position="topright"
                result={statusChangeResult}
            />
            <div
                id={`pinned-notes-${note?.id}`}
                className={`relative w-full ${
                    note?.isInternal
                        ? 'bg-[#F5F5F5]'
                        : note?.author?.role === UserRoles.RTO
                          ? 'bg-[#bfe7f6]'
                          : note?.isPinned
                            ? 'bg-[#FFDCDC]'
                            : note?.isSuccess === false
                              ? 'bg-error'
                              : 'bg-[#FEF6E6] '
                } p-4 rounded-xl shadow-lg `}
            >
                <div className={`${isDeleting ? 'blur' : ''}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography variant="label" semibold>
                                {note?.title ?? note?.subject}{' '}
                                <span className="text-xs text-gray-400">
                                    {note?.isInternal ? '(Internal)' : ''}
                                </span>
                            </Typography>
                            {note?.studentNote ? (
                                <div>
                                    <div className="flex items-center gap-x-2">
                                        <Typography variant="xs" semibold>
                                            {note?.studentNote?.noteTemplate
                                                ?.type ===
                                            NotesTemplateType[
                                                'Resolution Path Label'
                                            ]
                                                ? 'Resolution Path Label'
                                                : 'Status Check Label'}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <Typography variant="xxs">
                                            Type:{' '}
                                        </Typography>
                                        <Typography variant="xs" semibold>
                                            {note?.isSuccess
                                                ? 'Successfull'
                                                : 'Unsuccessfull'}{' '}
                                        </Typography>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <AuthorizedUserComponent
                            excludeRoles={[UserRoles.OBSERVER]}
                        >
                            <div className="flex items-center gap-x-1">
                                <div className="bg-white text-[#BF0000] w-6 h-6 flex justify-center items-center rounded-[5px] cursor-pointer">
                                    {audioLoading ? (
                                        <PuffLoader size={20} />
                                    ) : audioUrl && isPlaying ? (
                                        <HiMiniSpeakerXMark
                                            onClick={() => stopAudio()}
                                        />
                                    ) : (
                                        <HiMiniSpeakerWave
                                            onClick={() => handleSubmit()}
                                        />
                                    )}
                                </div>
                                <div
                                    onClick={togglePin}
                                    className={`${
                                        note?.isPinned
                                            ? 'bg-base-light'
                                            : 'bg-gray-100'
                                    }  w-6 h-6 flex justify-center items-center rounded-[5px] cursor-pointer`}
                                >
                                    {statusChangeResult.isLoading ? (
                                        <PuffLoader size={20} color="white" />
                                    ) : (
                                        <TiPin
                                            size={16}
                                            className={
                                                note?.isPinned
                                                    ? 'text-white'
                                                    : 'text-primaryNew'
                                            }
                                        />
                                    )}
                                </div>
                                <div
                                    className="bg-white text-[#BF0000] w-6 h-6 flex justify-center items-center rounded-[5px]"
                                    onClick={() => setDeleting(true)}
                                >
                                    <RiDeleteBinLine size={16} />
                                </div>
                            </div>
                        </AuthorizedUserComponent>
                    </div>
                    <div>
                        <div className={`text-sm mt-1 mb-2`}>
                            <span
                                className="block remove-text-bg customTailwingStyles-inline-style customTailwingStyles whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html: note?.body ?? note?.message,
                                }}
                            ></span>
                        </div>

                        <div className="flex justify-between">
                            <div className="mr-6">
                                <p
                                    className={`text-xs font-medium ${
                                        note?.isPinned
                                            ? 'text-red-800'
                                            : 'text-gray-500'
                                    } capitalize`}
                                >
                                    {authorName}
                                    <span className="text-[11px] font-medium capitalize">
                                        (
                                        {note?.author?.role ??
                                            note?.assignedTo?.role}
                                        )
                                    </span>
                                </p>
                                <p
                                    className={`text-[11px] font-medium ${
                                        note.isPinned
                                            ? 'text-red-800'
                                            : note?.isSuccess ||
                                                note?.isSuccess !== false
                                              ? 'text-[#BFBF80]'
                                              : 'text-white'
                                    } `}
                                >
                                    {moment(
                                        note?.isEnabled!! || note.createdAt!!
                                    )
                                        .tz('Australia/Melbourne')
                                        .format(
                                            'ddd DD, MMM, yyyy [at] hh:mm A'
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {isDeleting && (
                    <div className="absolute top-0 left-0 flex justify-end w-full h-full ">
                        <div className="w-full bg-[#ffffff60] px-2 py-2 rounded-xl">
                            <div className="flex items-center gap-x-2 mb-4">
                                <div className="bg-red-500 w-6 h-6 rounded-lg flex items-center justify-center text-white">
                                    <FaTrash />
                                </div>
                                <p className="font-medium text-sm">
                                    Delete Note!
                                </p>
                            </div>
                            <p className="text-sm mb-2">
                                Do you wish to continue?
                            </p>
                            <div className="flex gap-x-2">
                                <ActionButton
                                    variant="error"
                                    onClick={onDeleteClick}
                                    loading={removeResult.isLoading}
                                    disabled={removeResult.isLoading}
                                >
                                    Delete
                                </ActionButton>
                                <ActionButton
                                    simple
                                    onClick={() => setDeleting(false)}
                                >
                                    Cancel
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
