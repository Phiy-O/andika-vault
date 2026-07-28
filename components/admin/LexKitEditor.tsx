"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    createEditorSystem,
    richTextExtension,
    boldExtension,
    italicExtension,
    underlineExtension,
    strikethroughExtension,
    codeFormatExtension,
    blockFormatExtension,
    listExtension,
    linkExtension,
    imageExtension,
    horizontalRuleExtension,
    historyExtension,
    htmlExtension,
    codeExtension,
    tableExtension,
    htmlEmbedExtension,
} from "@lexkit/editor";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Indent,
    Outdent,
    Quote,
    Code2,
    Minus,
    ImageIcon,
    Pilcrow,
    Undo,
    Redo,
    Table,
    CodeXml,
    ChevronDown,
} from "lucide-react";

const extensions = [
    richTextExtension.configure({
        placeholder: "Start writing...",
        classNames: {
            contentEditable:
                "prose prose-invert max-w-none focus:outline-none px-4 py-3 min-h-[280px] text-sm text-foreground",
            placeholder: "text-muted text-sm px-4 py-3",
        },
        styles: {
            contentEditable: { caretColor: "#f5f0e9" },
        },
    }),
    boldExtension,
    italicExtension,
    underlineExtension,
    strikethroughExtension,
    codeFormatExtension,
    blockFormatExtension,
    listExtension,
    linkExtension.configure({ autoLinkUrls: true }),
    imageExtension,
    horizontalRuleExtension,
    historyExtension,
    htmlExtension,
    codeExtension,
    tableExtension,
    htmlEmbedExtension,
] as const;

const { Provider, useEditor } = createEditorSystem<typeof extensions>();

interface Props {
    content: string;
    onChange: (html: string) => void;
}

export function LexKitEditor({ content, onChange }: Props) {
    return (
        <Provider extensions={extensions}>
            <EditorShell content={content} onChange={onChange} />
        </Provider>
    );
}

function EditorShell({ content, onChange }: Props) {
    const { commands, editor, activeStates } = useEditor();
    const initialized = useRef(false);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Inject initial HTML content once on mount
    useEffect(() => {
        if (!editor || initialized.current) return;
        initialized.current = true;
        if (content) {
            // defer to avoid flushSync inside lifecycle method
            queueMicrotask(() => commands.importFromHTML(content));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Emit HTML changes to parent – use a ref to avoid stale closure
    useEffect(() => {
        if (!editor) return;
        return editor.registerUpdateListener(() => {
            const html = commands.exportToHTML();
            onChangeRef.current(html);
        });
    }, [editor, commands]);

    const addLink = useCallback(() => {
        const url = window.prompt("Link URL");
        if (url) commands.insertLink(url);
    }, [commands]);

    const addImage = useCallback(() => {
        const url = window.prompt("Image URL");
        if (url) commands.insertImage({ src: url, alt: "" });
    }, [commands]);

    // ── helpers ────────────────────────────────────────
    const a = activeStates as Record<string, boolean>;
    const currentBlock = commands.getCurrentBlockType();

    const blockOptions: { label: string; value: BlockFormat; icon?: React.ReactNode }[] = [
        { label: "Paragraph", value: "p", icon: <Pilcrow size={14} /> },
        { label: "Heading 1", value: "h1", icon: <Heading1 size={14} /> },
        { label: "Heading 2", value: "h2", icon: <Heading2 size={14} /> },
        { label: "Heading 3", value: "h3", icon: <Heading3 size={14} /> },
        { label: "Heading 4", value: "h4", icon: <Heading4 size={14} /> },
        { label: "Heading 5", value: "h5", icon: <Heading5 size={14} /> },
        { label: "Heading 6", value: "h6", icon: <Heading6 size={14} /> },
        { label: "Quote", value: "quote", icon: <Quote size={14} /> },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-line">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface/50 px-2 py-1.5">
                {/* Undo / Redo */}
                <ToolbarGroup>
                    <TbBtn label="Undo" icon={<Undo size={14} />} action={() => commands.undo()} />
                    <TbBtn label="Redo" icon={<Redo size={14} />} action={() => commands.redo()} />
                </ToolbarGroup>

                <Divider />

                {/* Block type dropdown */}
                <BlockDropdown
                    options={blockOptions}
                    value={currentBlock}
                    onChange={(val) => {
                        editor?.focus();
                        if (val === "p") commands.toggleParagraph();
                        else if (val === "quote") commands.toggleQuote();
                        else commands.toggleHeading(val);
                    }}
                />

                <Divider />

                {/* Text formatting */}
                <ToolbarGroup>
                    <TbBtn label="Bold" icon={<Bold size={14} />} active={a.bold} action={() => commands.toggleBold()} />
                    <TbBtn label="Italic" icon={<Italic size={14} />} active={a.italic} action={() => commands.toggleItalic()} />
                    <TbBtn label="Underline" icon={<Underline size={14} />} active={a.underline} action={() => commands.toggleUnderline()} />
                    <TbBtn label="Strikethrough" icon={<Strikethrough size={14} />} active={a.strikethrough} action={() => commands.toggleStrikethrough()} />
                    <TbBtn label="Inline Code" icon={<Code size={14} />} active={a.code} action={() => commands.toggleCode()} />
                </ToolbarGroup>

                <Divider />

                {/* Lists */}
                <ToolbarGroup>
                    <TbBtn label="Bullet List" icon={<List size={14} />} active={a.unorderedList} action={() => commands.toggleUnorderedList()} />
                    <TbBtn label="Ordered List" icon={<ListOrdered size={14} />} active={a.orderedList} action={() => commands.toggleOrderedList()} />
                    <TbBtn label="Indent" icon={<Indent size={14} />} action={() => commands.indentList()} />
                    <TbBtn label="Outdent" icon={<Outdent size={14} />} action={() => commands.outdentList()} />
                </ToolbarGroup>

                <Divider />

                {/* Insert items */}
                <ToolbarGroup>
                    <TbBtn label="Insert Table" icon={<Table size={14} />} action={() => commands.insertTable({ rows: 3, columns: 3 })} />
                    <TbBtn label="Insert Image" icon={<ImageIcon size={14} />} action={addImage} />
                    <TbBtn label="Horizontal Rule" icon={<Minus size={14} />} action={() => commands.insertHorizontalRule()} />
                    <TbBtn label="Code Block" icon={<Code2 size={14} />} active={a.isInCodeBlock} action={() => commands.toggleCodeBlock()} />
                    <TbBtn label="HTML Embed" icon={<CodeXml size={14} />} action={() => commands.insertHTMLEmbed()} />
                </ToolbarGroup>
            </div>
        </div>
    );
}

/* ── helpers ──────────────────────────────────── */

type BlockFormat = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "quote";

function ToolbarGroup({ children }: { children: React.ReactNode }) {
    return <span className="flex items-center gap-0.5">{children}</span>;
}

function Divider() {
    return <span className="mx-1 h-5 w-px bg-line" />;
}

function BlockDropdown({
    options,
    value,
    onChange,
}: {
    options: { label: string; value: BlockFormat; icon?: React.ReactNode }[];
    value: BlockFormat;
    onChange: (val: BlockFormat) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const active = options.find((o) => o.value === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
                {active?.icon}
                <span>{active?.label ?? "Paragraph"}</span>
                <ChevronDown size={12} />
            </button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-40 rounded-lg border border-line bg-[#17151c] p-1 shadow-xl">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
                            className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${opt.value === value
                                    ? "bg-purple/20 text-purple"
                                    : "text-muted hover:bg-surface hover:text-foreground"
                                }`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function TbBtn({
    label,
    icon,
    action,
    active,
}: {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                action();
            }}
            className={`rounded p-1.5 transition-colors ${active
                    ? "bg-purple/20 text-purple"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
            title={label}
        >
            {icon}
        </button>
    );
}

function InsertBtn({
    label,
    icon,
    action,
}: {
    label: string;
    icon: React.ReactNode;
    action: () => void;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                action();
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
        >
            {icon} {label}
        </button>
    );
}
