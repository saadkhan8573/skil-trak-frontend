import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getRoot,
  ElementFormatType,
} from 'lexical';
import {
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  List,
  ListOrdered,
  Type,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from 'lucide-react';
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagePlugin';
import { AdminApi } from '@queries';

const LowPriority = 1;

import { createPortal } from 'react-dom';

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const BlockOptionsDropdownList = ({
  editor,
  blockType,
  setShowBlockOptions,
  anchorElem,
}: {
  editor: any;
  blockType: string;
  setShowBlockOptions: (val: boolean) => void;
  anchorElem: HTMLElement;
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptions(false);
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
    setShowBlockOptions(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBlockOptions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setShowBlockOptions]);

  const rect = anchorElem.getBoundingClientRect();

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: 'max-content',
        maxHeight: '600px',
        overflowY: 'auto',
      }}
      className="bg-white border rounded shadow-lg z-[9999] py-1 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <button
        onClick={formatParagraph}
        className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${blockType === 'paragraph' ? 'bg-primary/5 text-primary font-semibold' : ''}`}
      >
        Normal
      </button>
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => (
        <button
          key={tag}
          onClick={() => formatHeading(tag)}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${blockType === tag ? 'bg-primary/5 text-primary font-semibold' : ''}`}
        >
          {blockTypeToBlockName[tag]}
        </button>
      ))}
    </div>
  );
};

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [showBlockOptions, setShowBlockOptions] = useState(false);
  const [uploadImage] = AdminApi.Blogs.uploadImage();
  const dropdownAnchorRef = React.useRef<HTMLDivElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type === 'ul' ? 'bullet' : 'number');
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const onImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = () => {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: file.name,
            src: reader.result as string,
          });
        };
        reader.readAsDataURL(file);

        // Start upload
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res: any = await uploadImage(formData);
          if (res?.data?.url) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: file.name,
              src: res.data.url,
            });
          }
        } catch (e) {
          console.error('Upload failed', e);
        }
      }
    };
  }, [editor, uploadImage]);

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10 flex-wrap">
      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-30"
        title="Redo"
      >
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Block Type Dropdown */}
      <div className="relative" ref={dropdownAnchorRef}>
        <button
          onClick={() => setShowBlockOptions(!showBlockOptions)}
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
          title="Text Style"
        >
          <span className="w-24 text-left truncate">
            {blockTypeToBlockName[blockType as keyof typeof blockTypeToBlockName] || 'Normal'}
          </span>
          <ChevronDown size={14} />
        </button>

        {showBlockOptions && dropdownAnchorRef.current && createPortal(
          <BlockOptionsDropdownList
            editor={editor}
            blockType={blockType}
            setShowBlockOptions={setShowBlockOptions}
            anchorElem={dropdownAnchorRef.current}
          />,
          document.body
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`p-1.5 rounded hover:bg-gray-200 ${isBold ? 'bg-primary/10 text-primary' : ''}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`p-1.5 rounded hover:bg-gray-200 ${isItalic ? 'bg-primary/10 text-primary' : ''}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`p-1.5 rounded hover:bg-gray-200 ${isUnderline ? 'bg-primary/10 text-primary' : ''}`}
        title="Underline"
      >
        <Underline size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={formatBulletList}
        className={`p-1.5 rounded hover:bg-gray-200 ${blockType === 'bullet' ? 'bg-primary/10 text-primary' : ''}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={formatNumberedList}
        className={`p-1.5 rounded hover:bg-gray-200 ${blockType === 'number' ? 'bg-primary/10 text-primary' : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className="p-1.5 rounded hover:bg-gray-200"
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className="p-1.5 rounded hover:bg-gray-200"
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className="p-1.5 rounded hover:bg-gray-200"
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={onImageUpload}
        className="p-1.5 rounded hover:bg-gray-200"
        title="Insert Image"
      >
        <ImageIcon size={18} />
      </button>
    </div>
  );
};
