import React, { ReactElement } from 'react'
import { AiVoiceCalls } from '@partials/common/ai-voice-calls'
import { AdminLayout } from '@layouts'

const AiVoiceCallsPage = () => {
    return (
        <AiVoiceCalls />
    )
}


AiVoiceCallsPage.getLayout = (page: ReactElement) => {
    return <AdminLayout>{page}</AdminLayout>
}

export default AiVoiceCallsPage