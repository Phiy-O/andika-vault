"use client";

import { useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Quote, Code2, Minus, ImageIcon, Pilcrow, Undo, Redo,
  ChevronDown,
} from "lucide-react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: Props) {
  const initialContent = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Image,
    ],
    content: initialContent.current,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose prose-invert max-w-none p-3 text-sm text-foreground",
      },
    },
  });

  /* Sync external content only when it truly differs from editor state */
  const prevContent = useRef(content);
  useEffect(() => {
    if (!editor) return;
    if (content !== prevContent.current) {
      prevContent.current = content;
      const current = editor.getHTML();
      if (current !== content) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [editor, content]);

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  type Btn = {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    active?: boolean;
  };

  const main: Btn[][] = [
    [
      { label: "Bold", icon: <Bold size={15} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
      { label: "Italic", icon: <Italic size={15} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
      { label: "Strikethrough", icon: <Strikethrough size={15} />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
      { label: "Code", icon: <Code size={15} />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code") },
    ],
    [
      { label: "Heading 1", icon: <Heading1 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
      { label: "Heading 2", icon: <Heading2 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
      { label: "Heading 3", icon: <Heading3 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
      { label: "Heading 4", icon: <Heading4 size={15} />, action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: editor.isActive("heading", { level: 4 }) },
    ],
    [
      { label: "Bullet List", icon: <List size={15} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
      { label: "Ordered List", icon: <ListOrdered size={15} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
      { label: "Blockquote", icon: <Quote size={15} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
      { label: "Code Block", icon: <Code2 size={15} />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
    ],
  ];

  const more: Btn[] = [
    { label: "Horizontal Rule", icon: <Minus size={15} />, action: () => editor.chain().focus().setHorizontalRule().run() },
    { label: "Image", icon: <ImageIcon size={15} />, action: addImage },
    { label: "Clear Formatting", icon: <Pilcrow size={15} />, action: () => editor.chain().focus().clearNodes().unsetAllMarks().run() },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface/50 px-2 py-1.5">
        {main.map((group, gi) => (
          <span key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="mx-1 h-5 w-px bg-line" />}
            {group.map((btn) => (
              <ToolbarBtn key={btn.label} {...btn} />
            ))}
          </span>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-0.5 rounded p-1.5 text-muted hover:bg-surface hover:text-foreground transition-colors"
            title="More"
          >
            <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 top-full z-50 mt-1 hidden min-w-[180px] rounded-lg border border-line bg-[#17151c] p-1 shadow-xl group-hover:block">
            {more.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <span className="ml-auto flex items-center gap-0.5">
          <ToolbarBtn label="Undo" icon={<Undo size={14} />} action={() => editor.chain().focus().undo().run()} />
          <ToolbarBtn label="Redo" icon={<Redo size={14} />} action={() => editor.chain().focus().redo().run()} />
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({ label, icon, action, active }: {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      className={`rounded p-1.5 transition-colors ${
        active
          ? "bg-purple/20 text-purple"
          : "text-muted hover:bg-surface hover:text-foreground"
      }`}
      title={label}
    >
      {icon}
    </button>
  );
}
