import { RtoLayoutV2 } from '@layouts'
import { SignDocuments } from '@partials'
import { FileSignature } from 'lucide-react'
import { ReactElement } from 'react'

const SignDocumentsPage = () => {
    return <SignDocuments />
}

SignDocumentsPage.getLayout = (page: ReactElement) => {
    return (
        <RtoLayoutV2
            titleProps={{
                Icon: FileSignature,
                title: 'Sign Documents',
                description: 'Sign pending documents',
            }}
        >
            {page}
        </RtoLayoutV2>
    )
}

export default SignDocumentsPage
