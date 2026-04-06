import { type ReactNode } from 'react'
import {
    DndContext,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface DndWrapperProps {
    children: ReactNode
    items: number[]
    onDragEnd: (oldIndex: number, newIndex: number) => void
}

export const DndWrapper = ({ children, items, onDragEnd }: DndWrapperProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor)
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                    const oldIndex = items.indexOf(Number(active.id))
                    const newIndex = items.indexOf(Number(over.id))
                    onDragEnd(oldIndex, newIndex)
                }
            }}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {children}
            </SortableContext>
        </DndContext>
    )
}
