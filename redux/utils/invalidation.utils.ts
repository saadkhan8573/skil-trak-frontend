
/**
 * Returns tags to invalidate only if the mutation was successful (no error).
 * @param tags The tags to invalidate on success.
 * @returns A function compatible with RTK Query's invalidatesTags.
 */
export const providesTagsOnSuccess = (tags: string[]) => (result: any, error: any) => {
    return error ? [] : tags
}
