'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import { useEffect, useRef } from 'react'
import { $isImageNode, ImageNode } from '../nodes/ImageNode'
import { isServerImageUrl } from '../constants'
import { AdminApi } from '@queries'

export default function ExternalImagePlugin(): null {
    const [editor] = useLexicalComposerContext()
    const [uploadImage] = AdminApi.Blogs.uploadImage()
    const [uploadImageByUrl] = AdminApi.Blogs.uploadImageByUrl()
    const processingNodes = useRef(new Set<string>())
    const mirrorQueue = useRef<Promise<void>>(Promise.resolve())

    useEffect(() => {
        const handleExternalImage = async (src: string, nodeKey: string) => {
            // Sequential queue logic: chain each new request onto the previous promise
            mirrorQueue.current = mirrorQueue.current.then(async () => {
                // Verify the node is still in the processing set (not removed or updated)
                if (!processingNodes.current.has(nodeKey)) return

                console.log(
                    `ExternalImagePlugin: 🔄 [Queue] Mirroring ${src.startsWith('data:') ? 'base64 image' : src}`
                )
                try {
                    let uploadedUrl = ''

                    if (src.startsWith('data:')) {
                        // 1. Convert data URL to Blob
                        const response = await fetch(src)
                        if (!response.ok) throw new Error(`Fetch base64 failed`)
                        const blob = await response.blob()

                        // 2. Prepare the file for upload
                        const inferredExt = blob.type.split('/')[1] || 'png'
                        const safeName = `pasted-image-${Date.now()}.${inferredExt}`
                        const file = new File([blob], safeName, {
                            type: blob.type || 'image/png',
                        })
                        const formData = new FormData()
                        formData.append('file', file)

                        // 3. Upload to server
                        console.log(
                            `ExternalImagePlugin: 📤 Uploading pasted base64 image...`
                        )
                        const res: any = await uploadImage(formData)
                        if (res?.error) throw new Error(res.error?.data?.message || 'Upload failed')
                        uploadedUrl = res?.data?.url
                    } else {
                        // Handle external URL via server-side mirroring
                        const res: any = await uploadImageByUrl({ url: src })
                        if (res?.error) {
                            console.warn(`ExternalImagePlugin: ⚠️ Server could not mirror ${src}. Using original URL.`);
                            return; // Leave the original URL in place
                        }
                        uploadedUrl = res?.data?.uploadedFile || res?.data?.url
                    }

                    if (uploadedUrl) {
                        console.log(
                            `ExternalImagePlugin: ✅ Successfully mirrored to ${uploadedUrl}`
                        )
                        editor.update(() => {
                            const node = $getNodeByKey(nodeKey)
                            if ($isImageNode(node)) {
                                node.setSrc(uploadedUrl)
                            }
                        })
                    } else {
                        console.warn(`ExternalImagePlugin: ⚠️ No URL in upload response for ${src}. Using original URL.`)
                    }
                } catch (e: any) {
                    // Check for CORS or network errors
                    if (
                        e.name === 'TypeError' &&
                        (e.message.includes('fetch') ||
                            e.message.includes('NetworkError'))
                    ) {
                        console.warn(
                            `ExternalImagePlugin: ⚠️ CORS block for ${src}. Manual upload available via button.`
                        )
                    } else {
                        console.error(
                            'ExternalImagePlugin: ❌ Mirroring failed:',
                            e
                        )
                    }
                } finally {
                    processingNodes.current.delete(nodeKey)
                }
            })

            // Ensure we wait for the current task to finish
            await mirrorQueue.current
        }

        return editor.registerNodeTransform(ImageNode, (node) => {
            const nodeKey = node.getKey()
            if (processingNodes.current.has(nodeKey)) {
                return
            }

            const src = node.getSrc()

            // Only process external images (not internal, not blob URLs)
            // Now including data: URLs to ensure they get uploaded
            if (src && !src.startsWith('blob:') && !isServerImageUrl(src)) {
                console.log(
                    `ExternalImagePlugin: [NodeTransform] Found external or base64 image to mirror: ${src.startsWith('data:') ? 'base64 data' : src}`
                )
                processingNodes.current.add(nodeKey)
                handleExternalImage(src, nodeKey)
            } else if (src && isServerImageUrl(src)) {
                // Image is already on the server, skip
            }
        })
    }, [editor, uploadImage, uploadImageByUrl])

    return null
}
