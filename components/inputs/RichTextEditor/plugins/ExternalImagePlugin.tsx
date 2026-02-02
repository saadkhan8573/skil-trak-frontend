"use client"

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { useEffect, useRef } from 'react';
import { $isImageNode, ImageNode } from '../nodes/ImageNode';
import { isServerImageUrl } from '../constants';
import { AdminApi } from '@queries';

export default function ExternalImagePlugin(): null {
    const [editor] = useLexicalComposerContext();
    const [uploadImage] = AdminApi.Blogs.uploadImage();
    const processingNodes = useRef(new Set<string>());
    const mirrorQueue = useRef<Promise<void>>(Promise.resolve());

    useEffect(() => {
        const handleExternalImage = async (src: string, nodeKey: string) => {
            // Sequential queue logic: chain each new request onto the previous promise
            mirrorQueue.current = mirrorQueue.current.then(async () => {
                // Verify the node is still in the processing set (not removed or updated)
                if (!processingNodes.current.has(nodeKey)) return;

                console.log(`ExternalImagePlugin: 🔄 [Queue] Mirroring ${src}`);
                try {
                    // 1. Fetch the external image
                    const response = await fetch(src, { mode: 'cors' });
                    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

                    const blob = await response.blob();
                    console.log(`ExternalImagePlugin: 📦 Fetched blob (${blob.size} bytes) for ${src}`);

                    // 2. Prepare the file for upload
                    const inferredExt = blob.type.split('/')[1] || 'png';
                    const fileNameFromUrl = (src.split('/').pop() || 'image').split('?')[0].split('#')[0];
                    const safeName = fileNameFromUrl.includes('.') ? fileNameFromUrl : `${fileNameFromUrl}.${inferredExt}`;

                    const file = new File([blob], safeName, { type: blob.type || 'image/png' });
                    const formData = new FormData();
                    formData.append('file', file);

                    // 3. Upload to server
                    console.log(`ExternalImagePlugin: 📤 Uploading ${safeName}...`);
                    const res: any = await uploadImage(formData);

                    if (res?.data?.url) {
                        console.log(`ExternalImagePlugin: ✅ Successfully mirrored to ${res.data.url}`);
                        editor.update(() => {
                            const node = $getNodeByKey(nodeKey);
                            if ($isImageNode(node)) {
                                node.setSrc(res.data.url);
                            }
                        });
                    } else {
                        throw new Error('No URL in upload response');
                    }
                } catch (e: any) {
                    // Check for CORS or network errors
                    if (e.name === 'TypeError' && (e.message.includes('fetch') || e.message.includes('NetworkError'))) {
                        console.warn(`ExternalImagePlugin: ⚠️ CORS block for ${src}. Manual upload available via button.`);
                    } else {
                        console.error('ExternalImagePlugin: ❌ Mirroring failed:', e);
                    }
                } finally {
                    processingNodes.current.delete(nodeKey);
                }
            });

            // Ensure we wait for the current task to finish
            await mirrorQueue.current;
        };

        return editor.registerNodeTransform(ImageNode, (node) => {
            const nodeKey = node.getKey();
            if (processingNodes.current.has(nodeKey)) {
                return;
            }

            const src = node.getSrc();

            // Only process external images (not internal, not data/blob URLs)
            if (
                src &&
                !src.startsWith('data:') &&
                !src.startsWith('blob:') &&
                !isServerImageUrl(src)
            ) {
                console.log(`ExternalImagePlugin: [NodeTransform] Found external image to mirror: ${src}`);
                processingNodes.current.add(nodeKey);
                handleExternalImage(src, nodeKey);
            } else if (src && isServerImageUrl(src)) {
                // Image is already on the server, skip
            }
        });
    }, [editor, uploadImage]);

    return null;
}
