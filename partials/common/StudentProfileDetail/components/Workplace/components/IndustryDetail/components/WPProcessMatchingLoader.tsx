import { Badge, Card } from '@components'
import {
    Brain,
    Compass,
    Radar,
    Search,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export const WPProcessMatchingLoader = () => {
    const [progress, setProgress] = useState(0)
    const [currentMessage, setCurrentMessage] = useState(
        'Initializing Workplace matching algorithm...'
    )
    const [currentPhase, setCurrentPhase] = useState(0)

    const phases = [
        {
            message: 'Initializing Workplace matching algorithm...',
            icon: Brain,
            color: 'primary-teal',
        },
        {
            message: 'Analyzing your preferences...',
            icon: Target,
            color: 'orange',
        },
        {
            message: 'Scanning workplace database...',
            icon: Radar,
            color: 'dark-teal',
        },
        {
            message: 'Evaluating location compatibility...',
            icon: Compass,
            color: 'primary-teal',
        },
        {
            message: 'Processing transport options...',
            icon: Search,
            color: 'orange',
        },
        {
            message: 'Checking partnership status...',
            icon: Sparkles,
            color: 'dark-teal',
        },
        {
            message: 'Matching course requirements...',
            icon: Brain,
            color: 'primary-teal',
        },
        {
            message: 'Calculating compatibility scores...',
            icon: Zap,
            color: 'orange',
        },
        {
            message: 'Finalizing perfect matches...',
            icon: Target,
            color: 'dark-teal',
        },
        {
            message: 'Matches found! Preparing results...',
            icon: Sparkles,
            color: 'orange',
        },
    ]

    useEffect(() => {
        let currentIndex = 0
        const totalDuration = 9000 // 9 seconds total
        const phaseInterval = totalDuration / phases.length

        const timer = setInterval(() => {
            currentIndex++

            if (currentIndex < phases.length) {
                setCurrentMessage(phases[currentIndex].message)
                setCurrentPhase(currentIndex)
                setProgress(((currentIndex + 1) / phases.length) * 100)
            } else {
                setProgress(100)
                clearInterval(timer)
            }
        }, phaseInterval)

        return () => clearInterval(timer)
    }, [])

    const CurrentIcon = phases[currentPhase]?.icon || Brain
    const currentColor = phases[currentPhase]?.color || 'primary-teal'

    return (
        <div className="py-10 px-5 relative w-full h-full p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/50">
            {/* Enhanced Header Section */}
            <div className="text-center mb-6 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-9">
                    {/* Main rotating icon with orbiting elements */}
                    <div className="relative">
                        <div className="relative w-10 h-10 animate-spin-slow">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#044866] via-[#0D5468] to-[#F7A619] flex items-center justify-center shadow-2xl">
                                <div className="animate-spin-reverse-slow">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Orbiting elements */}
                            <div
                                className="absolute w-1.5 h-1.5 rounded-full bg-[#F7A619] animate-orbit-1"
                                style={{ left: '50%', top: '50%' }}
                            ></div>
                            <div
                                className="absolute w-1.5 h-1.5 rounded-full bg-[#044866] animate-orbit-2"
                                style={{ left: '50%', top: '50%' }}
                            ></div>
                            <div
                                className="absolute w-1.5 h-1.5 rounded-full bg-[#F7A619] animate-orbit-3"
                                style={{ left: '50%', top: '50%' }}
                            ></div>
                            <div
                                className="absolute w-1.5 h-1.5 rounded-full bg-[#044866] animate-orbit-4"
                                style={{ left: '50%', top: '50%' }}
                            ></div>
                            <div
                                className="absolute w-1.5 h-1.5 rounded-full bg-[#F7A619] animate-orbit-5"
                                style={{ left: '50%', top: '50%' }}
                            ></div>
                        </div>

                        {/* Pulsing rings */}
                        <div className="absolute inset-0 rounded-full border border-orange/30 animate-pulse-ring-1"></div>
                        <div className="absolute inset-0 rounded-full border border-primary-teal/40 animate-pulse-ring-2"></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#F7A619] bg-clip-text text-transparent mb-2 animate-gradient-x">
                    Workplace Matching in Progress
                </h2>

                <p className="text-[#044866] font-medium animate-fade-in-delayed">
                    Our advanced algorithm is finding your perfect workplace
                    matches
                </p>
            </div>

            {/* Enhanced Main Loading Card */}
            <div className="animate-fade-in-up-delayed relative">
                <Card>
                    {/* Enhanced animated background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#04486620] via-[#F7A61920] to-dark-teal/5"></div>

                        {/* Floating particles */}
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#F7A619] animate-float-1"
                            style={{ left: '10%', top: '20%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#044866] animate-float-2"
                            style={{ left: '17%', top: '23%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#0D5468] animate-float-3"
                            style={{ left: '24%', top: '26%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#F7A619] animate-float-4"
                            style={{ left: '31%', top: '29%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#044866] animate-float-5"
                            style={{ left: '38%', top: '32%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#0D5468] animate-float-6"
                            style={{ left: '45%', top: '35%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#F7A619] animate-float-1"
                            style={{ left: '52%', top: '38%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#044866] animate-float-2"
                            style={{ left: '59%', top: '41%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#0D5468] animate-float-3"
                            style={{ left: '66%', top: '44%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#F7A619] animate-float-4"
                            style={{ left: '73%', top: '47%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#044866] animate-float-5"
                            style={{ left: '80%', top: '50%' }}
                        ></div>
                        <div
                            className="absolute w-0.5 h-0.5 rounded-full bg-[#0D5468] animate-float-6"
                            style={{ left: '87%', top: '53%' }}
                        ></div>
                    </div>

                    {/* Dynamic top scan lines */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F7A619] to-transparent animate-scan-right"></div>
                    <div className="absolute top-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-teal/50 to-transparent animate-scan-left"></div>

                    <div className="relative z-10 text-center pb-4 pt-6">
                        {/* Enhanced Current Status with Icon Animation */}
                        <div className="mb-5">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                {/* Animated current phase icon */}
                                <div className="relative animate-bounce-subtle">
                                    <div
                                        className={`p-2 rounded-xl shadow-lg bg-gradient-to-br transform transition-all duration-500 animate-pulse-glow ${
                                            currentColor === 'orange'
                                                ? 'from-[#F7A619] to-orange/80'
                                                : currentColor === 'dark-teal'
                                                ? 'from-[#0D5468] to-dark-teal/80'
                                                : 'from-[#044866] to-primary-teal/80'
                                        }`}
                                    >
                                        <CurrentIcon className="h-4 w-4 text-white animate-spin-slow" />
                                    </div>

                                    {/* Animated rings around icon */}
                                    <div
                                        className={`absolute inset-0 rounded-xl border animate-ping-slow ${
                                            currentColor === 'orange'
                                                ? 'border-orange/40'
                                                : currentColor === 'dark-teal'
                                                ? 'border-dark-teal/40'
                                                : 'border-primary-teal/40'
                                        }`}
                                    ></div>
                                </div>

                                <div className="text-left">
                                    <h3 className="font-bold text-[#0D5468] mb-1 transition-all duration-500 animate-fade-in">
                                        {currentMessage}
                                    </h3>
                                    <div className="text-[#044866] text-sm animate-slide-in">
                                        Phase {currentPhase + 1} of{' '}
                                        {phases.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Progress Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className=" text-[#044866] font-semibold animate-pulse">
                                    Processing
                                </span>
                                <div className="animate-bounce-subtle">
                                    <Badge text={`${Math.round(progress)}%`} />
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="relative">
                                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#044866] via-[#F7A619] to-[#0D5468] rounded-full relative overflow-hidden animate-gradient-x transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    >
                                        {/* Multiple shine effects */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-reverse"></div>
                                    </div>
                                </div>

                                {/* Progress markers */}
                                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-0.5 h-4 bg-white/60 rounded-full transition-all duration-300 ${
                                                progress > i * 25
                                                    ? 'animate-pulse opacity-100 scale-110'
                                                    : 'opacity-30'
                                            }`}
                                            style={{
                                                animationDelay: `${i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        {/* Enhanced Central Loading Animation */}
                        <div className="flex justify-center items-center">
                            <div className="relative">
                                {/* Outer rotating rings with different speeds */}
                                <div className="w-20 h-20 border-2 border-[#04486630] rounded-full relative animate-spin-slow">
                                    <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#044866] rounded-full transform -translate-x-1/2 -translate-y-0.5 shadow-lg animate-pulse"></div>
                                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary-teal/60 rounded-full transform -translate-x-1/2 translate-y-0.5 animate-pulse"></div>
                                </div>

                                {/* Middle ring */}
                                <div className="absolute inset-3 border-2 border-orange/40 rounded-full animate-spin-reverse">
                                    <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#F7A619] rounded-full transform -translate-x-1/2 -translate-y-0.5 shadow-md animate-pulse"></div>
                                    <div className="absolute right-0 top-1/2 w-1 h-1 bg-orange/60 rounded-full transform translate-x-0.5 -translate-y-1/2 animate-pulse"></div>
                                </div>

                                {/* Inner ring */}
                                <div className="absolute inset-6 border border-dark-teal/50 rounded-full animate-spin">
                                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#0D5468] rounded-full transform -translate-x-1/2 -translate-y-0.5 shadow-sm animate-pulse"></div>
                                </div>

                                {/* Enhanced Central Core */}
                                <div className="absolute inset-8 bg-gradient-to-br from-[#044866] via-[#0D5468] to-[#F7A619] rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
                                    <div className="animate-spin-slow">
                                        <Brain className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                {/* Floating energy particles around the entire system */}
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#F7A619] animate-orbit-particle-1"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#044866] animate-orbit-particle-2"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#0D5468] animate-orbit-particle-3"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#F7A619] animate-orbit-particle-4"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#044866] animate-orbit-particle-5"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#0D5468] animate-orbit-particle-6"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#F7A619] animate-orbit-particle-7"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                                <div
                                    className="absolute w-0.75 h-0.75 rounded-full bg-[#044866] animate-orbit-particle-8"
                                    style={{ left: '50%', top: '50%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fade-in-up-delayed {
                    from {
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fade-in-delayed {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slide-in {
                    from {
                        opacity: 0;
                        width: 0;
                    }
                    to {
                        opacity: 1;
                        width: 100%;
                    }
                }

                @keyframes gradient-x {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-reverse-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(-360deg);
                    }
                }

                @keyframes spin-reverse {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(-360deg);
                    }
                }

                @keyframes pulse-ring-1 {
                    0%,
                    100% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.2;
                    }
                }

                @keyframes pulse-ring-2 {
                    0%,
                    100% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: scale(1.8);
                        opacity: 0.1;
                    }
                }

                @keyframes bounce-subtle {
                    0%,
                    100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes glow {
                    0%,
                    100% {
                        box-shadow: 0 4px 20px rgba(247, 166, 25, 0.3);
                    }
                    50% {
                        box-shadow: 0 8px 25px rgba(247, 166, 25, 0.4);
                    }
                }

                @keyframes pulse-glow {
                    0%,
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 30px rgba(4, 72, 102, 0.4);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 50px rgba(247, 166, 25, 0.6);
                    }
                }

                @keyframes glow-primary {
                    0%,
                    100% {
                        box-shadow: 0 4px 20px rgba(4, 72, 102, 0.1);
                    }
                    50% {
                        box-shadow: 0 8px 25px rgba(4, 72, 102, 0.2);
                    }
                }

                @keyframes glow-[#F7A619] {
                    0%,
                    100% {
                        box-shadow: 0 4px 20px rgba(247, 166, 25, 0.1);
                    }
                    50% {
                        box-shadow: 0 8px 25px rgba(247, 166, 25, 0.2);
                    }
                }

                @keyframes glow-teal {
                    0%,
                    100% {
                        box-shadow: 0 4px 20px rgba(13, 84, 104, 0.1);
                    }
                    50% {
                        box-shadow: 0 8px 25px rgba(13, 84, 104, 0.2);
                    }
                }

                @keyframes scale-pulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes scan-right {
                    0% {
                        transform: translateX(-17%);
                    }
                    100% {
                        transform: translateX(17%);
                    }
                }

                @keyframes scan-left {
                    0% {
                        transform: translateX(17%);
                    }
                    100% {
                        transform: translateX(-17%);
                    }
                }

                @keyframes shine {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes shine-reverse {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                @keyframes progress-bar {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes progress-bar-delayed {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes progress-bar-fast {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes float-1 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes float-2 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes float-3 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes float-4 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes float-5 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes float-6 {
                    0%,
                    100% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes orbit-1 {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg)
                            translateX(50px) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg)
                            translateX(50px) rotate(-360deg);
                    }
                }

                @keyframes orbit-2 {
                    0% {
                        transform: translate(-50%, -50%) rotate(72deg)
                            translateX(50px) rotate(-72deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(432deg)
                            translateX(50px) rotate(-432deg);
                    }
                }

                @keyframes orbit-3 {
                    0% {
                        transform: translate(-50%, -50%) rotate(144deg)
                            translateX(50px) rotate(-144deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(504deg)
                            translateX(50px) rotate(-504deg);
                    }
                }

                @keyframes orbit-4 {
                    0% {
                        transform: translate(-50%, -50%) rotate(216deg)
                            translateX(50px) rotate(-216deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(576deg)
                            translateX(50px) rotate(-576deg);
                    }
                }

                @keyframes orbit-5 {
                    0% {
                        transform: translate(-50%, -50%) rotate(288deg)
                            translateX(50px) rotate(-288deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(648deg)
                            translateX(50px) rotate(-648deg);
                    }
                }

                @keyframes orbit-particle-1 {
                    0% {
                        transform: translate(-50%, -50%) translateX(40px)
                            translateY(0);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(-40px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(-40px)
                            translateY(0);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(40px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(40px)
                            translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-2 {
                    0% {
                        transform: translate(-50%, -50%) translateX(28px)
                            translateY(28px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(-28px)
                            translateY(28px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(-28px)
                            translateY(-28px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(28px)
                            translateY(-28px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(28px)
                            translateY(28px);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-3 {
                    0% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(40px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(40px)
                            translateY(0);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(-40px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(-40px)
                            translateY(0);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(40px);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-4 {
                    0% {
                        transform: translate(-50%, -50%) translateX(-28px)
                            translateY(28px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(-28px)
                            translateY(-28px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(28px)
                            translateY(-28px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(28px)
                            translateY(28px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(-28px)
                            translateY(28px);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-5 {
                    0% {
                        transform: translate(-50%, -50%) translateX(-40px)
                            translateY(0);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(40px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(40px)
                            translateY(0);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(0)
                            translateY(-40px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(-40px)
                            translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-6 {
                    0% {
                        transform: translate(-50%, -50%) translateX(35px)
                            translateY(20px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(-20px)
                            translateY(35px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(-35px)
                            translateY(-20px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(20px)
                            translateY(-35px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(35px)
                            translateY(20px);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-7 {
                    0% {
                        transform: translate(-50%, -50%) translateX(-35px)
                            translateY(20px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(-20px)
                            translateY(-35px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(35px)
                            translateY(-20px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(20px)
                            translateY(35px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(-35px)
                            translateY(20px);
                        opacity: 1;
                    }
                }

                @keyframes orbit-particle-8 {
                    0% {
                        transform: translate(-50%, -50%) translateX(20px)
                            translateY(35px);
                        opacity: 1;
                    }
                    25% {
                        transform: translate(-50%, -50%) translateX(35px)
                            translateY(-20px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(-50%, -50%) translateX(-20px)
                            translateY(-35px);
                        opacity: 1;
                    }
                    75% {
                        transform: translate(-50%, -50%) translateX(-35px)
                            translateY(20px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(20px)
                            translateY(35px);
                        opacity: 1;
                    }
                }

                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 0.2;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }

                .animate-fade-in-up-delayed {
                    animation: fade-in-up-delayed 0.7s ease-out 0.3s both;
                }

                .animate-fade-in-delayed {
                    animation: fade-in-delayed 1s ease-out 0.5s both;
                }

                .animate-slide-in {
                    animation: slide-in 0.5s ease-out;
                }

                .animate-gradient-x {
                    animation: gradient-x 4s ease-in-out infinite;
                    background-size: 200% 200%;
                }

                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }

                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 8s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 6s linear infinite;
                }

                .animate-pulse-ring-1 {
                    animation: pulse-ring-1 3s ease-in-out infinite;
                }

                .animate-pulse-ring-2 {
                    animation: pulse-ring-2 3s ease-in-out infinite 0.5s;
                }

                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }

                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                .animate-glow-primary {
                    animation: glow-primary 3s ease-in-out infinite;
                }

                .animate-glow-[#F7A619] {
                    animation: glow-[#F7A619] 3s ease-in-out infinite;
                }

                .animate-glow-teal {
                    animation: glow-teal 3s ease-in-out infinite;
                }

                .animate-scale-pulse {
                    animation: scale-pulse 2s ease-in-out infinite;
                }

                .animate-scan-right {
                    animation: scan-right 2.5s ease-in-out infinite;
                }

                .animate-scan-left {
                    animation: scan-left 3s ease-in-out infinite 0.5s;
                }

                .animate-shine {
                    animation: shine 2s ease-in-out infinite;
                }

                .animate-shine-reverse {
                    animation: shine-reverse 2.5s ease-in-out infinite 0.5s;
                }

                .animate-progress-bar {
                    animation: progress-bar 2s ease-in-out infinite;
                }

                .animate-progress-bar-delayed {
                    animation: progress-bar-delayed 2.5s ease-in-out infinite
                        0.3s;
                }

                .animate-progress-bar-fast {
                    animation: progress-bar-fast 1.8s ease-in-out infinite 0.7s;
                }

                .animate-float-1 {
                    animation: float-1 3s ease-in-out infinite;
                }

                .animate-float-2 {
                    animation: float-2 3.2s ease-in-out infinite 0.3s;
                }

                .animate-float-3 {
                    animation: float-3 3.4s ease-in-out infinite 0.6s;
                }

                .animate-float-4 {
                    animation: float-4 3.6s ease-in-out infinite 0.9s;
                }

                .animate-float-5 {
                    animation: float-5 3.8s ease-in-out infinite 1.2s;
                }

                .animate-float-6 {
                    animation: float-6 4s ease-in-out infinite 1.5s;
                }

                .animate-orbit-1 {
                    animation: orbit-1 4s linear infinite;
                }

                .animate-orbit-2 {
                    animation: orbit-2 4s linear infinite 0.2s;
                }

                .animate-orbit-3 {
                    animation: orbit-3 4s linear infinite 0.4s;
                }

                .animate-orbit-4 {
                    animation: orbit-4 4s linear infinite 0.6s;
                }

                .animate-orbit-5 {
                    animation: orbit-5 4s linear infinite 0.8s;
                }

                .animate-orbit-particle-1 {
                    animation: orbit-particle-1 4s ease-in-out infinite;
                }

                .animate-orbit-particle-2 {
                    animation: orbit-particle-2 4.2s ease-in-out infinite 0.15s;
                }

                .animate-orbit-particle-3 {
                    animation: orbit-particle-3 4.4s ease-in-out infinite 0.3s;
                }

                .animate-orbit-particle-4 {
                    animation: orbit-particle-4 4.6s ease-in-out infinite 0.45s;
                }

                .animate-orbit-particle-5 {
                    animation: orbit-particle-5 4.8s ease-in-out infinite 0.6s;
                }

                .animate-orbit-particle-6 {
                    animation: orbit-particle-6 5s ease-in-out infinite 0.75s;
                }

                .animate-orbit-particle-7 {
                    animation: orbit-particle-7 5.2s ease-in-out infinite 0.9s;
                }

                .animate-orbit-particle-8 {
                    animation: orbit-particle-8 5.4s ease-in-out infinite 1.05s;
                }

                .animate-ping-slow {
                    animation: ping-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
