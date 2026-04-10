import { VirtualizedListProps } from '../types'
import { CollapsedCommunicationCard } from './CollapsedCommunicationCard'

export const VirtualizedCommunicationList: React.FC<VirtualizedListProps> = ({
    items,
}) =>
    items?.map((item) => (
        <CollapsedCommunicationCard key={item.id} item={item} />
    ))
