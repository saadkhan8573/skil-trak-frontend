import { ReWritePhrase } from '@pages/api/openai/fixGrammer'
import { useState } from 'react'

export const useRewritePhrase = () => {
    const [isLoading, setIsLoading] = useState<any>(null)

    const onRewritePhrase = async (content: string) => {
        if (!content) {
            return
        }

        setIsLoading(true)
        // setError('')

        try {
            const response = await ReWritePhrase({ text: content })

            if (!response.ok) {
                throw new Error('Failed to correct grammar')
            }

            const data = await response.json()

            return data
        } catch (err) {
        } finally {
            setIsLoading(false)
        }
    }

    return { onRewritePhrase, isLoading }
}
