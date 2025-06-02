
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export function PrefillPlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (initialValue) {
      try {
        const parsed = editor.parseEditorState(initialValue)
        editor.setEditorState(parsed)
      } catch (error) {
        console.error("Failed to parse initial value", error)
      }
    }
  }, [editor, initialValue])

  return null
}
