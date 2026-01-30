import dynamic from 'next/dynamic'

// Dynamically import RichTextEditor with no SSR to ensure TipTap only loads on client
export const RichTextEditor = dynamic(
    () => import('./RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col gap-1 w-full animate-pulse">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="relative min-h-[300px] max-h-[500px] w-full rounded-md border border-input bg-muted/30 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading editor...</span>
                    </div>
                </div>
            </div>
        ),
    }
)
