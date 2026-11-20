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
    $createParagraphNode,
    $getRoot,
    $getSelection,
    $getNodeByKey,
    $isElementNode,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_TAB_COMMAND,
    PASTE_COMMAND,
    type ElementFormatType,
    type ElementNode,
} from "lexical";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
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
    ChevronDown,
} from "lucide-react";
import {
    ACCEPTED_IMAGE_TYPES,
    uploadImageFile,
} from "@/src/lib/upload-image";

const extensions = [
    richTextExtension.configure({
        placeholder: "Start writing...",
        classNames: {
            contentEditable:
                "lexkit-editor-content prose max-w-none focus:outline-none px-4 py-4 min-h-[360px] text-sm text-foreground bg-background cursor-text",
            placeholder: "text-muted text-sm px-4 py-4",
        },
        styles: {
            contentEditable: { caretColor: "#1b1b1b" },
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
        imageExtension.configure({
            pasteListener: { insert: false, replace: false },
        }),
        horizontalRuleExtension,
        historyExtension,
        htmlExtension,
        codeExtension,
        tableExtension,
        htmlEmbedExtension,
] as const;

const { Provider, useEditor } = createEditorSystem<typeof extensions>();

/** True when an element contains anything beyond empty paragraphs/linebreaks. */
function elementHasContent(element: ElementNode): boolean {
    return element.getChildren().some((child) => {
        if ($isElementNode(child) && child.getType() === "paragraph") {
            return elementHasContent(child);
        }
        if (child.getType() === "linebreak") return false;
        if (child.getType() === "text") {
            return child.getTextContent().trim().length > 0;
        }
        return true;
    });
}

interface Props {
    content: string;
    onChange: (html: string) => void;
    variant?: "default" | "focus";
}

export function LexKitEditor({ content, onChange, variant = "default" }: Props) {
    return (
        <Provider extensions={extensions}>
            <EditorShell content={content} onChange={onChange} variant={variant} />
        </Provider>
    );
}

function EditorShell({ content, onChange, variant = "default" }: Props) {
    const { editor, commands, activeStates } = useEditor();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initialized = useRef(false);
    const onChangeRef = useRef(onChange);
    const suppressChanges = useRef(false);
    const [currentBlock, setCurrentBlock] = useState<BlockFormat>("p");
    const [currentAlign, setCurrentAlign] = useState<ElementFormatType>("left");
    const [uploadError, setUploadError] = useState("");
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const insertUploadedImage = useCallback(
        (file: File) => {
            if (!editor) return;
            setUploadError("");
            void uploadImageFile(file)
                .then((url) => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if (!$isRangeSelection(selection)) {
                            const paragraph = $createParagraphNode();
                            $getRoot().append(paragraph);
                            paragraph.select();
                        }
                        commands.insertImage({ src: url, alt: file.name });
                    });
                })
                .catch((error: unknown) => {
                    setUploadError(
                        error instanceof Error ? error.message : "Upload gagal, coba lagi"
                    );
                });
        },
        [editor, commands]
    );

    useEffect(() => {
        if (!editor) return;

        return editor.registerCommand(
            PASTE_COMMAND,
            (event: ClipboardEvent) => {
                const items = event.clipboardData?.items;
                if (!items) return false;
                const item = Array.from(items).find((candidate) =>
                    candidate.type.startsWith("image/")
                );
                if (!item) return false;
                const file = item.getAsFile();
                if (!file) return false;

                event.preventDefault();
                insertUploadedImage(file);
                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, insertUploadedImage]);

    useEffect(() => {
        if (!editor || variant !== "focus") return;

        return editor.registerCommand(
            KEY_TAB_COMMAND,
            (event: KeyboardEvent) => {
                if (event.shiftKey) return false;
                event.preventDefault();
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertText("\t");
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, variant]);

    useEffect(() => {
        if (!editor) return;

        return editor.registerCommand(
            KEY_BACKSPACE_COMMAND,
            (event: KeyboardEvent) => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
                if (selection.anchor.offset !== 0) return false;

                const anchorNode = selection.anchor.getNode();
                const element = anchorNode.getTopLevelElement();
                if (!element || element.getType() !== "paragraph") return false;
                if (element.getTextContent().trim().length > 0) return false;

                const previous = element.getPreviousSibling();
                if (!previous || previous.getType() !== "table" || !$isElementNode(previous)) {
                    return false;
                }

                const tableHasContent = previous.getChildren().some(
                    (row) =>
                        $isElementNode(row) &&
                        row.getChildren().some(
                            (cell) => $isElementNode(cell) && elementHasContent(cell)
                        )
                );
                if (!tableHasContent) {
                    event.preventDefault();
                    const tableKey = previous.getKey();
                    const paragraphKey = element.getKey();
                    editor.update(() => {
                        $getNodeByKey(tableKey)?.remove();
                        const paragraph = $getNodeByKey(paragraphKey);
                        if (paragraph && $isElementNode(paragraph)) {
                            paragraph.selectStart();
                        }
                    });
                    return true;
                }

                event.preventDefault();
                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    // Inject initial HTML content once on mount, suppressing the import emissions
    useEffect(() => {
        if (!editor || initialized.current) return;
        initialized.current = true;
        
        // Ensure content is valid HTML before importing
        const safeContent = (() => {
            if (!content || typeof content !== 'string') return "<p></p>";
            const trimmed = content.trim();
            if (!trimmed) return "<p></p>";
            // If content is plain text without HTML tags, wrap it
            if (!trimmed.startsWith('<')) return `<p>${trimmed}</p>`;
            return trimmed;
        })();
        
        suppressChanges.current = true;
        queueMicrotask(() => {
            try {
                commands.importFromHTML(safeContent);
            } catch {
                // Fallback to empty paragraph on import error
                try {
                    commands.importFromHTML("<p></p>");
                } catch {}
            }
            queueMicrotask(() => {
                suppressChanges.current = false;
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Emit HTML changes to parent + keep block type in sync with selection.
    // Only emit when not suppressing mount-time import changes.
    useEffect(() => {
        if (!editor) return;
        return editor.registerUpdateListener(({ editorState }) => {
            const html = commands.exportToHTML();
            if (!suppressChanges.current) {
                onChangeRef.current(html);
            }
            setCurrentBlock(commands.getCurrentBlockType());
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    const element = $isElementNode(node) ? node : node.getParent();
                    setCurrentAlign(element?.getFormatType() ?? "left");
                }
            });
        });
    }, [editor, commands]);

    // Guard against the browser's native "scroll focused element into view"
    // when clicking the contentEditable: the click's focus processing can make
    // the browser land focus on the nearest focusable element above (the
    // toolbar) and scroll the page up to it. Restore the scroll position when
    // an unexpected jump happens right after a mousedown on the editor.
    // Note: the Provider renders the contentEditable in a sibling container,
    // so listen on document and match by target.
    const scrollGuard = useRef<{ y: number; t: number } | null>(null);
    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            const t = e.target as HTMLElement | null;
            if (
                t &&
                t.closest &&
                (t.closest('[contenteditable="true"]') ||
                    (wrapperRef.current && wrapperRef.current.contains(t)))
            ) {
                scrollGuard.current = { y: window.scrollY, t: Date.now() };
            }
        };
        const onScroll = () => {
            const g = scrollGuard.current;
            if (!g || Date.now() - g.t > 800) return;
            const delta = window.scrollY - g.y;
            if (Math.abs(delta) > 50) {
                window.scrollTo({ top: g.y, behavior: "instant" });
            }
            scrollGuard.current = null;
        };

        document.addEventListener("mousedown", onMouseDown, true);
        document.addEventListener("scroll", onScroll, true);

        // Clicking an unfocused contentEditable makes the browser natively
        // drop focus from it mid-click and fall back to the nearest focusable
        // element above (the toolbar's Undo button). That steals the selection
        // so the caret disappears/blinks until the user clicks again. preventDefault
        // on the click keeps the native fallback from running while Lexical's
        // own onClick handler still processes the click, so the caret lands
        // exactly where the user clicked on the first try.
        const onClick = (e: MouseEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest && t.closest('[contenteditable="true"]')) {
                e.preventDefault();
            }
        };
        document.addEventListener("click", onClick, true);

        // Track focus on the contentEditable (sibling container) so the
        // wrapper border lights up when the body area is active.
        const onFocusIn = (e: FocusEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest && t.closest('[contenteditable="true"]')) {
                setFocused(true);
            }
        };
        const onFocusOut = (e: FocusEvent) => {
            const t = e.target as HTMLElement | null;
            const next = e.relatedTarget as HTMLElement | null;
            if (
                t &&
                t.closest &&
                t.closest('[contenteditable="true"]') &&
                !(next && next.closest && next.closest('[contenteditable="true"]'))
            ) {
                setFocused(false);
            }
        };
        document.addEventListener("focusin", onFocusIn, true);
        document.addEventListener("focusout", onFocusOut, true);

        return () => {
            document.removeEventListener("mousedown", onMouseDown, true);
            document.removeEventListener("scroll", onScroll, true);
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("focusin", onFocusIn, true);
            document.removeEventListener("focusout", onFocusOut, true);
        };
    }, []);

    const pickImage = useCallback(() => {
        setUploadError("");
        fileInputRef.current?.click();
    }, []);

    // LexKit's insertTable requires a range selection. On a fresh body (or
    // after a node is selected) there is none, so the toolbar button would
    // silently do nothing. Focus the editor and create a caret first.
    const insertTable = useCallback(() => {
        if (!editor) return;

        editor.focus();
        editor.update(() => {
            if ($isRangeSelection($getSelection())) return;

            const root = $getRoot();
            if (root.getChildrenSize() === 0) {
                root.append($createParagraphNode());
            }
            root.selectEnd();
        });

        commands.insertTable({ rows: 3, columns: 3 });
    }, [editor, commands]);

    // ── helpers ────────────────────────────────────────
    const a = activeStates as Record<string, boolean>;

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
        <div
            ref={wrapperRef}
            className={`overflow-visible border-2 transition-colors ${focused
                    ? "border-purple shadow-[2px_2px_0_var(--foreground)]"
                    : "border-line"
                } bg-background`}
        >
            {uploadError && (
                <p
                    role="alert"
                    className="border-b-2 border-admin-alert bg-[#f9e8e6] px-3 py-2 font-jet text-[9px] font-bold uppercase tracking-[.06em] text-admin-alert"
                >
                    {uploadError}
                </p>
            )}
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b-2 border-line bg-admin-wash px-2 py-1.5">
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

                {/* Alignment */}
                <AlignDropdown
                    value={currentAlign}
                    onChange={(val) => {
                        editor?.focus();
                        editor?.dispatchCommand(FORMAT_ELEMENT_COMMAND, val);
                    }}
                />

                <Divider />

                {/* Insert items */}
                <ToolbarGroup>
                    <TbBtn label="Insert Table" icon={<Table size={14} />} action={insertTable} />
                    <TbBtn label="Insert Image" icon={<ImageIcon size={14} />} action={pickImage} />
                    <TbBtn label="Horizontal Rule" icon={<Minus size={14} />} action={() => commands.insertHorizontalRule()} />
                    <TbBtn label="Code Block" icon={<Code2 size={14} />} active={a.isInCodeBlock} action={() => commands.toggleCodeBlock()} />
                </ToolbarGroup>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) insertUploadedImage(file);
                    event.target.value = "";
                }}
            />
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
                className="flex items-center gap-1.5 border-2 border-line bg-surface px-2 py-1.5 text-xs font-space font-bold tracking-[-.01em] text-foreground hover:bg-admin-wash transition-colors"
            >
                {active?.icon}
                <span>{active?.label ?? "Paragraph"}</span>
                <ChevronDown size={12} />
            </button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-40 border-2 border-line bg-surface p-1 shadow-[3px_3px_0_var(--foreground)]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
                            className={`flex w-full items-center gap-2 border-2 border-transparent px-3 py-1.5 text-xs font-sans transition-colors ${opt.value === value
                                    ? "bg-purple text-foreground"
                                    : "text-muted hover:bg-admin-wash hover:text-foreground"
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

function AlignDropdown({
    value,
    onChange,
}: {
    value: ElementFormatType;
    onChange: (val: ElementFormatType) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const options: { label: string; value: ElementFormatType; icon: React.ReactNode }[] = [
        { label: "Align Left", value: "left", icon: <AlignLeft size={14} /> },
        { label: "Align Center", value: "center", icon: <AlignCenter size={14} /> },
        { label: "Align Right", value: "right", icon: <AlignRight size={14} /> },
        { label: "Justify", value: "justify", icon: <AlignJustify size={14} /> },
    ];
    const active = options.find((o) => o.value === value) ?? options[0];

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
                className="flex items-center gap-1.5 border-2 border-line bg-surface px-2 py-1.5 text-xs font-space font-bold tracking-[-.01em] text-foreground hover:bg-admin-wash transition-colors"
            >
                {active.icon}
                <span>{active.label}</span>
                <ChevronDown size={12} />
            </button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-40 border-2 border-line bg-surface p-1 shadow-[3px_3px_0_var(--foreground)]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
                            className={`flex w-full items-center gap-2 border-2 border-transparent px-3 py-1.5 text-xs font-sans transition-colors ${opt.value === value
                                    ? "bg-purple text-foreground"
                                    : "text-muted hover:bg-admin-wash hover:text-foreground"
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
            aria-label={label}
            aria-pressed={active === undefined ? undefined : active}
            className={`border-2 p-1.5 transition-colors active:translate-y-px ${active
                    ? "border-line bg-purple text-foreground hover:border-foreground hover:bg-purple/90"
                    : "border-transparent text-muted hover:border-line hover:bg-surface hover:text-foreground"
                }`}
            title={label}
        >
            {icon}
        </button>
    );
}