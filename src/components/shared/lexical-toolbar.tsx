"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useCallback, useEffect, useState } from "react"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical"

import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
 // REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text"
import {QUOTE} from '@lexical/markdown'
import { $createParagraphNode } from "lexical"
import { $setBlocksType } from "@lexical/selection"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
} from "lucide-react"

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [blockType, setBlockType] = useState("paragraph")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))

      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag()
          setBlockType(tag)
        } else {
          setBlockType(element.getType())
        }
      }
    }
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
        type="button"
        className="p-1"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
        type="button"
        className="p-1"
      >
        <Redo className="h-4 w-4" />
      </button>
      <span className="divider" />
      <button
        onClick={() => formatHeading("h1")}
        className={blockType === "h1" ? "active p-1" : "p-1"}
        title="Heading 1"
        type="button"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatHeading("h2")}
        className={blockType === "h2" ? "active p-1" : "p-1"}
        title="Heading 2"
        type="button"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => formatHeading("h3")}
        className={blockType === "h3" ? "active p-1" : "p-1"}
        title="Heading 3"
        type="button"
      >
        <Heading3 className="h-4 w-4" />
      </button>
      <button
        onClick={formatParagraph}
        className={blockType === "paragraph" ? "active p-1" : "p-1"}
        title="Paragraph"
        type="button"
      >
        <span className="text-sm">¶</span>
      </button>
      <span className="divider" />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        className={isBold ? "active p-1" : "p-1"}
        title="Bold"
        type="button"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        className={isItalic ? "active p-1" : "p-1"}
        title="Italic"
        type="button"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }}
        className={isUnderline ? "active p-1" : "p-1"}
        title="Underline"
        type="button"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }}
        className={isStrikethrough ? "active p-1" : "p-1"}
        title="Strikethrough"
        type="button"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <span className="divider" />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }}
        title="Align Left"
        type="button"
        className="p-1"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }}
        title="Align Center"
        type="button"
        className="p-1"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }}
        title="Align Right"
        type="button"
        className="p-1"
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <span className="divider" />
      <button
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)

        }}
        title="Bullet List"
        type="button"
        className="p-1"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
         editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)

        }}
        title="Numbered List"
        type="button"
        className="p-1"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(QUOTE, undefined)
        }}
        title="Quote"
        type="button"
        className="p-1"
      >
        <Quote className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ToolbarPlugin
