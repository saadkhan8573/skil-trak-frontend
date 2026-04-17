import { getUserCredentials } from '@utils'
import {
    PrimaryActionButton,
    PrimaryActionButtonProps,
} from './PrimaryActionButton'
import { Permissions } from '@components'

export const DisplayPrimaryActions = ({
    actions,
}: {
    actions: PrimaryActionButtonProps[]
}) => {
    const status = getUserCredentials()?.status
    return (
        <div className="min-w-70 flex flex-col justify-center items-center gap-y-2">
            {actions.map((action, i) =>
                action.permissions ? (
                    <Permissions permission={action.permissions} key={i}>
                        <PrimaryActionButton
                            link={status === 'approved' ? action.link : `#`}
                            title={action.title}
                            description={action.description}
                            image={action.image}
                            animation={action.animation}
                            id={action.id}
                            badge={action?.badge}
                        />
                    </Permissions>
                ) : (
                    <PrimaryActionButton
                        key={i}
                        link={status === 'approved' ? action.link : `#`}
                        title={action.title}
                        description={action.description}
                        image={action.image}
                        animation={action.animation}
                        id={action.id}
                        badge={action?.badge}
                    />
                )
            )}
        </div>
    )
}
