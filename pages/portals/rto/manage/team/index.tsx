import { RtoLayoutV2 } from '@layouts'
import { RtoTeam } from '@partials'
import { NextPageWithLayout } from '@types'
import { User } from 'lucide-react'
import { ReactElement } from 'react'

const RtoTeamPage: NextPageWithLayout = () => {
    return <RtoTeam />
}

RtoTeamPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: User,
                title: 'Teams',
                description: 'Manage all your Teams',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default RtoTeamPage
