import { Building2 } from 'lucide-react'

interface EmptySectorStateProps {}

export const EmptySectorState: React.FC<EmptySectorStateProps> = () => (
    <div className="text-center py-12 text-muted-foreground">
        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>
            No sectors configured yet. Add your first sector above to get
            started.
        </p>
    </div>
)
