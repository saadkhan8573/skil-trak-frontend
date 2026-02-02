"use client"

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $insertNodes, $isNodeSelection, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_LOW, createCommand, ElementFormatType, FORMAT_ELEMENT_COMMAND, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '../nodes/ImageNode';
import { mergeRegister } from '@lexical/utils';

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand();

export default function ImagePlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagePlugin: ImageNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand<ImagePayload>(
                INSERT_IMAGE_COMMAND,
                (payload: ImagePayload) => {
                    const imageNode = $createImageNode(payload);
                    $insertNodes([imageNode]);
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand<ElementFormatType>(
                FORMAT_ELEMENT_COMMAND,
                (payload: ElementFormatType) => {
                    const selection = $getSelection();
                    if ($isNodeSelection(selection)) {
                        const nodes = selection.getNodes();
                        for (const node of nodes) {
                            if ($isImageNode(node)) {
                                if (payload === 'left' || payload === 'right' || payload === 'center') {
                                    node.setAlignment(payload);
                                }
                            }
                        }
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [editor]);

    return null;
}
