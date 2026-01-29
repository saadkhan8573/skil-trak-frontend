import { useEffect, useRef, useState } from 'react'
import { Appointment, User } from '@types'
import { getUserCredentials } from '@utils'
import { useRouter } from 'next/router'
import { generateSignature } from './ZoomMeetingContainer'

const ZoomComponent = ({
    appointment,
    profile,
}: {
    appointment: Appointment
    profile: { user: User }
}) => {
    const ref = useRef<any>(null)
    const [sdkLoaded, setSdkLoaded] = useState(false)
    const sdkRef = useRef<any>(null)

    const router = useRouter()

    const urlRole =
        getUserCredentials()?.role === 'subadmin'
            ? 'sub-admin'
            : getUserCredentials()?.role

    const leaveUrl = `${window.location?.origin}/portals/${urlRole}`

    useEffect(() => {
        // Load Zoom SDK dynamically on the client
        const loadZoom = async () => {
            try {
                const { ZoomMtg } = await import('@zoomus/websdk')
                const { default: ZoomMtgEmbedded } = await import('@zoomus/websdk/embedded')

                ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')
                ZoomMtg.preLoadWasm()
                ZoomMtg.prepareWebSDK()
                ZoomMtg.i18n.load('en-US')
                ZoomMtg.i18n.reload('en-US')

                sdkRef.current = { ZoomMtg, ZoomMtgEmbedded }
                setSdkLoaded(true)
            } catch (error) {
                console.error('Failed to load Zoom SDK:', error)
            }
        }

        loadZoom()
    }, [])

    useEffect(() => {
        if (sdkLoaded && sdkRef.current && ref.current) {
            const { ZoomMtg, ZoomMtgEmbedded } = sdkRef.current
            const client = ZoomMtgEmbedded.createClient()

            client?.init({ zoomAppRoot: ref.current, language: 'en-US' })

            client?.join({
                signature:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJfSnBDSG1Vd1FmbVAxYkI3Z1JLR3F3IiwiYXBwS2V5IjoiX0pwQ0htVXdRZm1QMWJCN2dSS0dxdyIsIm1uIjoxMjM0NTY3ODksInJvbGUiOjEsImlhdCI6MTY4NzMzMzIzNiwiZXhwIjoxNjg3MzQwNDM2LCJ0b2tlbkV4cCI6MTY4NzM0MDQzNn0.qC6X6N0xjJ1lS3bMtDedBPY-jsyquwUMu3dl6JcpKAM',
                sdkKey: 'xBUoRawFkQYpg1mLeVkS5dSTaZ8F0IMS',
                meetingNumber: '12',
                password: '',
                userName: 'Saad',
                userEmail: '',
                zak: 'eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6InpDelQ3OER0VGtlc3Q0WDNkcWJjSkEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjEsIndjZCI6InVzMDUiLCJjbHQiOjAsIm1udW0iOiI4NTYwNDMzODUwOSIsImV4cCI6MTY4NzI2NDk1MywiaWF0IjoxNjg3MjU3NzUzLCJhaWQiOiJjbHlZem5CcVM4aWhEWWY5aFpJbzRBIiwiY2lkIjoiIn0.jx4CULEN7vFnCu9wO_ZreSdrWz8EC4EEKSiFh9mW4hI',
            })

            ZoomMtg.init({
                leaveUrl,
                success: (success: any) => {
                    ZoomMtg.join({
                        signature: generateSignature(
                            '_JpCHmUwQfmP1bB7gRKGqw',
                            'xBUoRawFkQYpg1mLeVkS5dSTaZ8F0IMS',
                            Number(
                                appointment?.startUrl
                                    ?.split('?zak=')[0]
                                    ?.split('https://us05web.zoom.us/s/')[1]
                            ) || 0,
                            0
                        ),
                        sdkKey: '_JpCHmUwQfmP1bB7gRKGqw',
                        meetingNumber: Number(
                            appointment?.startUrl
                                ?.split('?zak=')[0]
                                ?.split('https://us05web.zoom.us/s/')[1]
                        ) || 0,
                        passWord: appointment?.joinUrl?.split('pwd=')[1],
                        userName: profile?.user?.name,
                        userEmail: profile?.user?.email,
                        tk: '',
                        zak: appointment?.startUrl?.split('zak=')[1],
                        success: (success: any) => {
                            console.log(success)
                        },
                        error: (error: any) => {
                            console.log(error)
                        },
                    })
                },
                error: (error: any) => {
                    console.log(error)
                },
            })
        }
    }, [sdkLoaded, ref.current])

    return (
        <div ref={ref} className="w-96 h-96">
            {!sdkLoaded && <p>Loading Zoom...</p>}
        </div>
    )
}
export default ZoomComponent
