export const getGender = (gender?: string): string | undefined => {
    if (!gender) return undefined

    switch (gender.toLowerCase()) {
        case 'f':
        case 'female':
            return 'Female'
        case 'm':
        case 'male':
            return 'Male'
        case 'o':
        case 'other':
            return 'Other'
        default:
            return undefined
    }
}
