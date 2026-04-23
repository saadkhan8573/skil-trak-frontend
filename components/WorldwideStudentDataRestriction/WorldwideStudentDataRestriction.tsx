// WorldwideStudentDataRestriction.tsx
import { BlurOverlay } from '@components/BlurOverlay'
import { useWorldwideStudentDataRestriction } from './useWorldwideStudentDataRestriction'

export const WorldwideStudentDataRestriction = ({
    anotherUserId,
    children,
    fallbackOptions = {
        height: '20px',
        width: '20px',
    },
}: {
    children: any
    anotherUserId: number
    fallbackOptions?: {
        height?: string
        width?: string
    }
}) => {
    const { shouldBlur } = useWorldwideStudentDataRestriction({
        userId: anotherUserId,
    })

    // ✅ One condition, one boolean, zero mount cycles
    //    shouldBlur covers: loading, error, restricted without access
    if (shouldBlur) {
        return <BlurOverlay {...fallbackOptions} />
    }

    return children
}
