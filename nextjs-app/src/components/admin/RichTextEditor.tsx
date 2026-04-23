import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Code, Layout, Palette, Type, ChevronDown } from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const TEMPLATES = [
    {
        name: 'Thẻ Thông tin (Xanh)',
        html: `
        <div class="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl shadow-sm mb-6">
            <h3 class="text-lg font-black text-blue-800 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined">info</span> Tiêu đề thông tin
            </h3>
            <p class="text-sm text-slate-700">Nội dung chi tiết của thẻ thông tin ở đây...</p>
        </div>`
    },
    {
        name: 'Thẻ Cảnh báo (Đỏ)',
        html: `
        <div class="bg-red-50 border border-red-100 p-6 rounded-3xl shadow-sm mb-6">
            <h3 class="text-lg font-black text-red-800 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined">warning</span> Lưu ý quan trọng
            </h3>
            <p class="text-sm text-slate-700">Nội dung cảnh báo hoặc quy định nghiêm ngặt...</p>
        </div>`
    },
    {
        name: 'Lưới 2 Cột (Responsive)',
        html: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                <h4 class="font-black text-slate-800 mb-2">Cột 1</h4>
                <p class="text-xs text-slate-600">Nội dung cột trái...</p>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                <h4 class="font-black text-slate-800 mb-2">Cột 2</h4>
                <p class="text-xs text-slate-600">Nội dung cột phải...</p>
            </div>
        </div>`
    },
    {
        name: 'Thẻ Thưởng (Vàng)',
        html: `
        <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-6 rounded-3xl text-center mb-6">
            <span class="material-symbols-outlined text-4xl text-amber-500 mb-2">military_tech</span>
            <h3 class="text-xl font-black text-amber-900 mb-1">MỨC THƯỞNG 2 TRIỆU</h3>
            <p class="text-xs text-amber-700">Dành cho các thành tích đặc biệt xuất sắc</p>
        </div>`
    }
];

type Level = 1 | 2 | 3;

const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
    className = ""
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`px-2 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${active
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            } ${className}`}
    >
        {children}
    </button>
);

import { Node, mergeAttributes } from '@tiptap/core';

const Div = Node.create({
    name: 'div',
    group: 'block',
    content: 'block+',
    parseHTML() {
        return [{ tag: 'div' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes), 0];
    },
    addAttributes() {
        return {
            class: { default: null },
            style: { default: null },
        };
    },
});

const Span = Node.create({
    name: 'span',
    group: 'inline',
    inline: true,
    content: 'inline*',
    parseHTML() {
        return [{ tag: 'span' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes), 0];
    },
    addAttributes() {
        return {
            class: { default: null },
            style: { default: null },
        };
    },
});

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Div,
            Span,
        ],
        content,
        onUpdate: ({ editor }) => {
            if (!isSourceMode) {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose-editor min-h-[300px] outline-none px-6 py-5 text-sm text-slate-700 leading-relaxed',
            },
        },
        immediatelyRender: false
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML() && !isSourceMode) {
            editor.commands.setContent(content);
        }
    }, [content, editor, isSourceMode]);

    if (!editor) return null;

    const insertTemplate = (templateHtml: string) => {
        editor.chain().focus().insertContent(templateHtml).run();
        setShowTemplates(false);
    };

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all relative flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50/80 border-b border-gray-100 no-print">
                
                {/* Mode Toggle */}
                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-1">
                    <ToolbarButton
                        title="Chế độ trực quan"
                        onClick={() => setIsSourceMode(false)}
                        active={!isSourceMode}
                    >
                        <Type size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Chế độ Mã nguồn (HTML)"
                        onClick={() => setIsSourceMode(true)}
                        active={isSourceMode}
                    >
                        <Code size={16} />
                    </ToolbarButton>
                </div>

                {!isSourceMode && (
                    <>
                        {/* Templates Dropdown */}
                        <div className="relative pr-2 border-r border-gray-200 mr-1">
                            <ToolbarButton
                                title="Mẫu thiết kế đẹp"
                                onClick={() => setShowTemplates(!showTemplates)}
                                active={showTemplates}
                                className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                            >
                                <Layout size={16} />
                                <span className="text-[10px] uppercase tracking-wider">Mẫu Đẹp</span>
                                <ChevronDown size={12} />
                            </ToolbarButton>

                            {showTemplates && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in slide-in-from-top-2">
                                    {TEMPLATES.map((t) => (
                                        <button
                                            key={t.name}
                                            type="button"
                                            onClick={() => insertTemplate(t.html)}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Text style */}
                        <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                            <ToolbarButton title="Đậm" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                                <b>B</b>
                            </ToolbarButton>
                            <ToolbarButton title="Nghiêng" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                                <i>I</i>
                            </ToolbarButton>
                            <ToolbarButton title="Gạch chân" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                                <u>U</u>
                            </ToolbarButton>
                        </div>

                        {/* Headings */}
                        <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                            <ToolbarButton title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
                                <span className="text-xs">H2</span>
                            </ToolbarButton>
                            <ToolbarButton title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
                                <span className="text-xs">H3</span>
                            </ToolbarButton>
                        </div>

                        {/* Lists */}
                        <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200 mr-1">
                            <ToolbarButton title="Dấu chấm" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
                                <span>•</span>
                            </ToolbarButton>
                            <ToolbarButton title="Số" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
                                <span className="text-xs">1.</span>
                            </ToolbarButton>
                        </div>

                        {/* Quote */}
                        <div className="flex items-center gap-0.5">
                            <ToolbarButton title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()}>
                                <span className="text-sm">↩</span>
                            </ToolbarButton>
                            <ToolbarButton title="Làm lại" onClick={() => editor.chain().focus().redo().run()}>
                                <span className="text-sm">↪</span>
                            </ToolbarButton>
                        </div>
                    </>
                )}
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-hidden">
                {isSourceMode ? (
                    <textarea
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full min-h-[300px] p-6 font-mono text-xs bg-slate-900 text-green-400 outline-none resize-none"
                        spellCheck={false}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>

            {!isSourceMode && !editor.getText() && placeholder && (
                <p className="absolute top-[4.5rem] left-6 text-sm text-slate-400 pointer-events-none select-none italic font-medium">
                    {placeholder}
                </p>
            )}
        </div>
    );
}

