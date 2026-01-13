import { Button } from '@components'
import { Clock, Plus } from 'lucide-react'

interface ModeSelectorProps {
    mode: 'fixed' | 'free-shifts'
    onModeChange: (mode: 'fixed' | 'free-shifts') => void
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
    return (
        <div className="w-full flex items-center gap-1.5 mb-2">
            <Button
                onClick={() => onModeChange('fixed')}
                variant={'primaryNew'}
                outline={mode !== 'fixed'}
            >
                <Clock className="w-2.5 h-2.5 mr-1" />
                Fixed Hours
            </Button>
            <Button
                onClick={() => onModeChange('free-shifts')}
                variant={'success'}
                outline={mode !== 'free-shifts'}
            >
                <Plus className="w-2.5 h-2.5 mr-1" />
                Placement Shifts
            </Button>
        </div>
    )
}
