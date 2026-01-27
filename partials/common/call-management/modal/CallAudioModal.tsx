import { Play, Pause, Volume2, Headphones, Download } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { PlacementCall } from '@types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { CommonApi } from '@queries'
import moment from 'moment'

interface CallAudioModalProps {
    call: PlacementCall
    onClose: () => void
}

export function CallAudioModal({ call, onClose }: CallAudioModalProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [volume, setVolume] = useState(1)

    // Fetch the recording URL
    const { data, isLoading } = CommonApi.CallManagement.useGetCallRecordingQuery(
        String(call.callId),
        { skip: !call.callId }
    )

    const audioUrl = data?.url || call.recordingUrl

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sm:rounded-2xl shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#044866] to-[#0D5468] z-0" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

                <DialogHeader className="relative z-10 px-5 pt-5 pb-3">
                    <div className="flex justify-between items-start">
                        <div className="text-white">
                            <div className="flex items-center gap-2 mb-1 opacity-90">
                                <Headphones className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-medium tracking-wide uppercase">Audio Recording</span>
                            </div>
                            <DialogTitle className="text-lg font-semibold leading-tight text-white mb-0">
                                {call.student?.user?.name || 'Unknown Student'}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {/* Player Area */}
                <div className="relative z-10 bg-white rounded-t-3xl px-5 py-6 mt-2">
                    {/* Vinyl Record Animation / Visualizer Placeholder */}
                    <div className="flex justify-center mb-3">
                        <div className={`relative w-14 h-14 rounded-full border-2 border-gray-100 shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-200 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <div className="absolute inset-0 rounded-full border border-gray-300 opacity-50" />
                            <div className="absolute inset-2 rounded-full border border-gray-300 opacity-50" />
                            <div className="absolute inset-4 rounded-full border border-gray-300 opacity-50" />
                            <div className="w-6 h-6 rounded-full bg-[#044866] flex items-center justify-center shadow-inner">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-2 w-32 bg-gray-200 rounded mb-2" />
                                <span className="text-xs text-gray-400">Loading audio...</span>
                            </div>
                        </div>
                    ) : audioUrl ? (
                        <div className="space-y-5">
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                onTimeUpdate={onTimeUpdate}
                                onLoadedMetadata={onLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                            />

                            {/* Progress bar */}
                            <div className="space-y-1.5">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#044866]"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 font-medium font-mono">
                                    <span>{moment.utc(currentTime * 1000).format('mm:ss')}</span>
                                    <span>{moment.utc(duration * 1000).format('mm:ss')}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                {/* Volume */}
                                <div className="flex items-center gap-2 group w-24">
                                    <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-[#044866] transition-colors" />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#044866]"
                                    />
                                </div>

                                {/* Play/Pause Button */}
                                <button
                                    onClick={togglePlay}
                                    className="w-14 h-14 bg-[#044866] hover:bg-[#095a7d] text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6 fill-current" />
                                    ) : (
                                        <Play className="w-6 h-6 fill-current ml-1" />
                                    )}
                                </button>

                                {/* Download/Extra */}
                                <a
                                    href={audioUrl}
                                    download
                                    className="p-2 text-gray-400 hover:text-[#044866] hover:bg-gray-50 rounded-full transition-all"
                                    title="Download Recording"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-sm text-gray-500">No recording available for this call.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
