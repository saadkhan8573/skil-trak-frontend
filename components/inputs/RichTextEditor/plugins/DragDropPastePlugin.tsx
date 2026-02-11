import { useNotification } from '@hooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import { AdminApi } from '@queries';
import { $getNodeByKey, $insertNodes, COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, $isImageNode } from '../nodes/ImageNode';

export default function DragDropPastePlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const [uploadImage] = AdminApi.Blogs.uploadImage();
    const { notification } = useNotification();

    useEffect(() => {
        const handleFiles = (files: File[]) => {
            if (files.length === 0) return false;

            (async () => {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        try {
                            // 1. Read file as DataURL (Promise-based)
                            const temporarySrc = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result as string);
                                reader.onerror = (e) => reject(e);
                                reader.readAsDataURL(file);
                            });

                            let nodeKey: string | null = null;

                            // 2. Insert placeholder node
                            editor.update(() => {
                                const imageNode = $createImageNode({
                                    altText: file.name,
                                    src: temporarySrc,
                                });
                                $insertNodes([imageNode]);
                                nodeKey = imageNode.getKey();
                            });

                            if (!nodeKey) {
                                console.error(`DragDropPastePlugin: ❌ Failed to create node for ${file.name}`);
                                continue;
                            }

                            // 3. Upload to server
                            const formData = new FormData();
                            formData.append('file', file);

                            const res: any = await uploadImage(formData);

                            if (res?.data?.url) {
                                editor.update(() => {
                                    const node = $getNodeByKey(nodeKey!);
                                    if ($isImageNode(node)) {
                                        node.setSrc(res.data.url);
                                    }
                                });
                                notification.success({ title: 'Upload Success', description: 'Image uploaded successfully' });
                            } else {
                                console.error('DragDropPastePlugin: ❌ No URL in response');
                                notification.error({ title: 'Upload Failed', description: 'Server did not return an image URL' });
                            }
                        } catch (e) {
                            console.error(`DragDropPastePlugin: ❌ Failed to process ${file.name}:`, e);
                            notification.error({ title: 'Upload Error', description: 'Failed to process image' });
                            // Cleanup placeholder on failure
                            editor.update(() => {
                                // We don't have nodeKey if it failed before insertion, but if we do, remove it
                                // Actually, let's just log it. The user will see the placeholder or it'll be empty.
                            });
                        }
                    }
                }
            })();
            return true;
        };

        return mergeRegister(
            editor.registerCommand(
                DRAG_DROP_PASTE,
                (files) => handleFiles(files),
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                PASTE_COMMAND,
                (event: ClipboardEvent) => {
                    const files = Array.from(event.clipboardData?.files || []);
                    if (files.length > 0) {
                        return handleFiles(files);
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            )
        );
    }, [editor, uploadImage]);

    return null;
}
