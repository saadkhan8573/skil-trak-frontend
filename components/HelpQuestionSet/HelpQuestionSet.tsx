import { Typography } from '@components/Typography'
import { useJoyRide } from '@hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HelpQuestion {
    text: string
    link: string
    steps?: any
    joyrideCallback?: any
}
interface HelpQuestionSetProps {
    title: string
    questions: HelpQuestion[]
    smallHeading?: boolean
}
export const HelpQuestionSet = ({
    title,
    questions,
    smallHeading,
}: HelpQuestionSetProps) => {
    const [mounted, setMounted] = useState(false)
    const joyride = useJoyRide()

    const onQuestionClick = (steps: any, callback: any) => {
        joyride.setState({
            run: true,
            tourActive: true,
            steps,
            callback: callback(joyride),
        })
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div>
            {smallHeading ? (
                <Typography variant="muted" color="text-blue-800">
                    {title}
                </Typography>
            ) : (
                <Typography variant="label">{title}</Typography>
            )}
            {mounted ? (
                <ul>
                    {questions.map((question, i) =>
                        question.steps ? (
                            <li
                                key={i}
                                onClick={() => {
                                    onQuestionClick(
                                        question.steps,
                                        question.joyrideCallback
                                    )
                                }}
                                className="cursor-pointer"
                            >
                                <p className="text-blue-400 text-sm hover:text-blue-500">
                                    {question.text}
                                </p>
                            </li>
                        ) : (
                            <li key={i}>
                                <Link href={question.link} className="text-blue-400 cursor-pointer text-sm hover:text-blue-500">

                                    {question.text}

                                </Link>
                            </li>
                        )
                    )}
                </ul>
            ) : null}
        </div>
    );
}
