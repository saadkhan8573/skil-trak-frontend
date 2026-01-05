import { Play } from 'lucide-react'
import { StatusWrapper } from '../StatusWrapper'

export const PlacementStarted = () => (
    <StatusWrapper>
        <div className="p-4 bg-green-50 border rounded-xl flex gap-3">
            <Play className="h-5 w-5 text-green-600" />
            <p className="font-medium">Placement In Progress</p>
        </div>
    </StatusWrapper>
)
