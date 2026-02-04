"use client"

import React, { useEffect, useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode, $isElementNode, $isDecoratorNode, EditorState } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';

import { Toolbar } from './components/Toolbar';
import { ImageNode } from './nodes/ImageNode';
import ImagePlugin from './plugins/ImagePlugin';
import DragDropPastePlugin from './plugins/DragDropPastePlugin';
import ExternalImagePlugin from './plugins/ExternalImagePlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';

import { Typography } from '@components';

// Theme for Lexical
const theme = {
  placeholder: 'editor-placeholder',
  paragraph: 'mb-2 text-gray-700',
  quote: 'border-l-4 border-gray-300 pl-4 italic my-4',
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
    h4: 'text-lg font-bold mb-2',
    h5: 'text-base font-bold mb-1',
    h6: 'text-sm font-bold mb-1 uppercase tracking-wider',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-6 mb-4',
    ul: 'list-disc ml-6 mb-4',
    listitem: 'mb-1',
  },
  image: 'editor-image',
  link: 'text-primary underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
};

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder,
  className,
}: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initialConfig = {
    namespace: 'SkilTrakEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      ImageNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode
    ],
  };

  const handleOnChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      console.log('RichTextEditor: handleOnChange firing', { htmlString });
      if (onChange) {
        onChange(htmlString);
      }
    });
  };

  if (!isMounted) return null;

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <div className="mb-2">
          <Typography variant={'label'}>{label}</Typography>
        </div>
      )}

      <div className={`border rounded-md overflow-hidden bg-white min-h-[200px] max-h-[500px] flex flex-col border-gray-300`}>
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar />
          <div className="relative flex-1 overflow-auto">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none py-4 px-4 min-h-[150px] prose prose-sm max-w-none"
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                  {placeholder || 'Start typing...'}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ImagePlugin />
            <DragDropPastePlugin />
            <ExternalImagePlugin />
            <FloatingLinkEditorPlugin />
            <OnChangePlugin onChange={handleOnChange} />

            {/* Initial Value Plugin */}
            <InitialValuePlugin value={value} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  )
}

// Helper plugin to set and update HTML value
function InitialValuePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // console.log('InitialValuePlugin: effect triggered', { value, isFirstRender });
    const updateContent = () => {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value || '', 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();

        // Wrap text nodes in paragraph if needed to avoid "Only element or decorator nodes" error
        let currentParagraph: any = null;

        nodes.forEach((node) => {
          if ($isElementNode(node) || $isDecoratorNode(node)) {
            if (currentParagraph) {
              root.append(currentParagraph);
              currentParagraph = null;
            }
            root.append(node);
          } else {
            if (!currentParagraph) {
              currentParagraph = $createParagraphNode();
            }
            currentParagraph.append(node);
          }
        });

        if (currentParagraph) {
          root.append(currentParagraph);
        }

        // If empty, ensure at least one paragraph
        if (root.isEmpty()) {
          root.append($createParagraphNode());
        }
      });
    };

    if (isFirstRender) {
      if (value) {
        updateContent();
      }
      setIsFirstRender(false);
    } else if (value !== undefined) {
      editor.read(() => {
        const currentHtml = $generateHtmlFromNodes(editor, null);
        console.log('InitialValuePlugin: checking update', { currentHtml, newValue: value, areEqual: currentHtml === value });
        if (currentHtml !== value) {
          console.log('RichTextEditor: Updating external value', { newValue: value });
          updateContent();
        }
      })
    }
  }, [editor, value, isFirstRender]);

  return null;
}
