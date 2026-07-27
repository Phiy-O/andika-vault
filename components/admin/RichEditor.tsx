"use client";

import { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export function RichEditor({ content, onChange: _onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(_onChange);
  onChangeRef.current = _onChange;

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const q = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "code"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    if (content) q.clipboard.dangerouslyPasteHTML(0, content, "user");

    q.on("text-change", () => {
      onChangeRef.current(q.root.innerHTML);
    });

    editorRef.current = q;
  }, []);

  return (
    <div className="rich-editor rounded-lg border border-line overflow-hidden [&_.ql-toolbar]:border-line [&_.ql-toolbar]:bg-surface/50 [&_.ql-container]:border-transparent [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-foreground [&_.ql-editor]:text-sm">
      <div ref={containerRef} />
    </div>
  );
}
