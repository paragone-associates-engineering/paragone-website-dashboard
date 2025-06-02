
import { useState, useEffect } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { TRANSFORMERS } from "@lexical/markdown"
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary"
import ToolbarPlugin from "./lexical-toolbar"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import type { EditorState } from "lexical"
import { cn } from "@/lib/utils"
import { PrefillPlugin } from "./plugins/prefill"

interface LexicalEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  readOnly?: boolean
  minHeight?: string
}

export function LexicalEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  error = false,
  readOnly = false,
  minHeight = "200px",
}: LexicalEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [editorState, setEditorState] = useState<string>(value || "")


  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

 
  // Sync with external value
  useEffect(() => {
    if (value !== editorState) {
      setEditorState(value)
    }
  }, [value])

  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      root: "p-0 relative outline-none",
      link: "cursor-pointer text-blue-500 underline",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
      },
    },
    onError(error: Error) {
      console.error(error)
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    // editorState: () => {
    //   // Initialize with existing content if available
    //   if (value) {
    //     try {
    //       return value
    //     } catch (error) {
    //       console.error("Error parsing editor state:", error)
    //     }
    //   }
    //   return null
    // },
    editable: !readOnly,
  }

  const handleEditorChange = (state: EditorState) => {
    state.read(() => {
      const jsonString = JSON.stringify(state.toJSON())
      setEditorState(jsonString)
      onChange(jsonString)
    })
  }

  if (!mounted) {
    return (
      <div
        className={cn("border rounded-md p-3", error ? "border-red-500" : "border-input", className)}
        style={{ minHeight }}
      >
        <div className="animate-pulse bg-gray-100 h-full w-full" />
      </div>
    )
  }

  return (
    <div className={cn("lexical-editor border rounded-md overflow-hidden", error && "border-red-500", className)}>
      <style>
        {`
          .lexical-editor .editor-container {
            position: relative;
            border-radius: 0.375rem;
            background: white;
          }
          .lexical-editor .editor-inner {
            background: white;
            position: relative;
          }
          .lexical-editor .editor-input {
            min-height: ${minHeight};
            max-height: 500px;
            resize: none;
            font-size: 15px;
            position: relative;
            tab-size: 1;
            outline: 0;
            padding: 15px 10px;
            overflow-y: auto;
          }
          .lexical-editor .editor-placeholder {
            color: #999;
            overflow: hidden;
            position: absolute;
            text-overflow: ellipsis;
            top: 15px;
            left: 10px;
            font-size: 15px;
            user-select: none;
            display: inline-block;
            pointer-events: none;
          }
          .lexical-editor .editor-paragraph {
            margin: 0 0 15px 0;
            position: relative;
          }
          .lexical-editor .toolbar {
            display: flex;
            flex-wrap: wrap;
            padding: 4px;
            border-bottom: 1px solid #eee;
          }
          .lexical-editor .toolbar button {
            border: 0;
            background: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            margin-right: 2px;
          }
          .lexical-editor .toolbar button:hover {
            background-color: #f1f1f1;
          }
          .lexical-editor .toolbar button.active {
            background-color: #e1e1e1;
          }
          .lexical-editor .toolbar .divider {
            width: 1px;
            background-color: #eee;
            margin: 0 4px;
          }
        `}
      </style>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">{placeholder}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <OnChangePlugin onChange={handleEditorChange} />
            <PrefillPlugin initialValue={value} />
          </div>
        </div>
      </LexicalComposer>
      {error && <p className="text-sm text-red-500 mt-1 px-2 pb-1">This field is required</p>}
    </div>
  )
}
