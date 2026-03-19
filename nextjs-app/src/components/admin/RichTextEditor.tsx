"use client";

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

type Level = 1 | 2 | 3;

const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`px-2 py-1.5 rounded-lg text-sm font-bold transition-all ${active
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose-editor min-h-[240px] outline-none px-4 py-3 text-sm text-slate-700 leading-relaxed',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    const toolbar: Array<{
        title: string;
        label: string;
        action: () => void;
        active: boolean;
    }> = [
            {
                title: 'Đậm',
                label: 'B',
                action: () => editor.chain().focus().toggleBold().run(),
                active: editor.isActive('bold'),
            },
            {
                title: 'Nghiêng',
                label: 'I',
                action: () => editor.chain().focus().toggleItalic().run(),
                active: editor.isActive('italic'),
            },
            {
                title: 'Gạch chân',
                label: 'U',
                action: () => editor.chain().focus().toggleUnderline().run(),
                active: editor.isActive('underline'),
            },
        ];

    const headings: Array<{ level: Level; label: string }> = [
        { level: 1, label: 'H1' },
        { level: 2, label: 'H2' },
        { level: 3, label: 'H3' },
    ];

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all relative">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50/80 border-b border-gray-100">

                {/* Text style */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                    {toolbar.map((btn) => (
                        <ToolbarButton
                            key={btn.title}
                            title={btn.title}
                            onClick={btn.action}
                            active={btn.active}
                        >
                            <span className={btn.title === 'Đậm' ? 'font-black' : btn.title === 'Nghiêng' ? 'italic' : 'underline'}>
                                {btn.label}
                            </span>
                        </ToolbarButton>
                    ))}
                </div>

                {/* Headings */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                    {headings.map(({ level, label }) => (
                        <ToolbarButton
                            key={label}
                            title={`Tiêu đề ${level}`}
                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                            active={editor.isActive('heading', { level })}
                        >
                            <span className="text-xs">{label}</span>
                        </ToolbarButton>
                    ))}
                    <ToolbarButton
                        title="Đoạn văn"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        active={editor.isActive('paragraph')}
                    >
                        <span className="text-xs">¶</span>
                    </ToolbarButton>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                    <ToolbarButton
                        title="Danh sách dấu chấm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                    >
                        <span className="text-base leading-none">≡</span>
                    </ToolbarButton>
                    <ToolbarButton
                        title="Danh sách đánh số"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                    >
                        <span className="text-xs">1.</span>
                    </ToolbarButton>
                </div>

                {/* Quote */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                    <ToolbarButton
                        title="Trích dẫn"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                    >
                        <span className="text-base leading-none">"</span>
                    </ToolbarButton>
                    <ToolbarButton
                        title="Ngắt đoạn"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        active={false}
                    >
                        <span className="text-xs">—</span>
                    </ToolbarButton>
                </div>

                {/* Undo / Redo */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        title="Hoàn tác"
                        onClick={() => editor.chain().focus().undo().run()}
                        active={false}
                    >
                        <span className="text-sm">↩</span>
                    </ToolbarButton>
                    <ToolbarButton
                        title="Làm lại"
                        onClick={() => editor.chain().focus().redo().run()}
                        active={false}
                    >
                        <span className="text-sm">↪</span>
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />

            {!editor.getText() && placeholder && (
                <p className="absolute top-[4.5rem] left-4 text-sm text-slate-400 pointer-events-none select-none">
                    {placeholder}
                </p>
            )}
        </div>
    );
}
