import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { type Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import MenuBar from "./menu-bar";
import { useEffect, useRef } from "react";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);

interface RichTextEditorProps {
	content: string | Content;
	onChange: (htmlContent: string) => void;
	placeholder?: string;
	editable?: boolean;
}

export default function RichTextEditor({
	content,
	onChange,
	placeholder = "Start writing...",
	editable = true,
}: RichTextEditorProps) {
	const isInternalUpdate = useRef(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
			TextStyle.configure(),
			FontFamily.configure(),
			Underline.configure(),
			Link.configure({
				openOnClick: false,
				autolink: true,
				linkOnPaste: true,
				HTMLAttributes: {
					rel: "noopener noreferrer",
					target: "_blank",
				},
			}),
			Image.configure({
				inline: false,
				allowBase64: true,
			}),
			Placeholder.configure({
				placeholder,
			}),
			CodeBlockLowlight.configure({
				lowlight,
			}),
		],
		content,
		editable,
		onUpdate: ({ editor: currentEditor }) => {
			isInternalUpdate.current = true;
			onChange(currentEditor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose dark:prose-invert focus:outline-none p-3 min-h-[150px] max-w-full",
			},
		},
	});

	useEffect(() => {
		if (editor && typeof content === "string" && !isInternalUpdate.current) {
			const currentContent = editor.getHTML();
			if (currentContent !== content) {
				editor.commands.setContent(content, false);
			}
		}
		isInternalUpdate.current = false;
	}, [editor, content]);

	return (
		<div className="border border-border rounded-md">
			{editable && <MenuBar editor={editor} />}
			<EditorContent
				editor={editor}
				className="overflow-y-auto custom-scrollbar min-h-14"
			/>
		</div>
	);
}