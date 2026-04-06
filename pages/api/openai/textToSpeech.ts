import { NextResponse } from 'next/server'

export async function TextToSpeech(request: any) {
    try {
        const { text } = request

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            )
        }

        // Check if OpenAI API key is configured
        if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        // Make the request to OpenAI's text-to-speech API
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'tts-1', // or "tts-1-hd" for higher quality
                voice: 'alloy', // Options: alloy, echo, fable, onyx, nova, shimmer
                input: text,
            }),
        })

        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))

            // Handle specific OpenAI API errors
            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Invalid API key' },
                    { status: 401 }
                )
            }

            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'API quota exceeded' },
                    { status: 429 }
                )
            }

            throw new Error(
                `OpenAI API error: ${response.status} ${response.statusText}`
            )
        }

        // Get the audio data as an array buffer
        const audioBuffer = await response.arrayBuffer()

        // Convert the response to a buffer
        const buffer = Buffer.from(audioBuffer)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename=speech.mp3',
            },
        })
    } catch (error) {
        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'Invalid API key' },
                    { status: 401 }
                )
            }

            if (
                error.message.includes('quota') ||
                error.message.includes('billing')
            ) {
                return NextResponse.json(
                    { error: 'API quota exceeded' },
                    { status: 429 }
                )
            }
        }

        return NextResponse.json(
            { error: 'Failed to generate speech' },
            { status: 500 }
        )
    }
}
