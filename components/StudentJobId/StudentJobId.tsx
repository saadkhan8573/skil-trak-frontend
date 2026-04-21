import { Badge } from '@components/Badge'

export const StudentJobId = ({ studentJobId }: { studentJobId: string }) => {
    return (
        <div>
            <Badge
                text={studentJobId}
                variant="primaryNew"
                className="whitespace-pre"
            />
        </div>
    )
}
