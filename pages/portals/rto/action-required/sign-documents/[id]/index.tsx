import { withPermission } from '@components'
import { RtoLayoutV2 } from '@layouts'
import { ViewDocumentAndSign } from '@partials'
import { PermissionType } from '@types'
import { FileSignature } from 'lucide-react'
import React, { ReactElement } from 'react'

const SignDocumentsDetailPage = () => {
    return <ViewDocumentAndSign />
}

SignDocumentsDetailPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: FileSignature,
                title: 'Sign Documents Detail',
                description: 'Sign pending documents detail',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default withPermission(SignDocumentsDetailPage, {
    permissions: [PermissionType.SIGN_DOCUMENTS],
})
