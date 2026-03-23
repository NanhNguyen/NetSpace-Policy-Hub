"use client";

import { useEffect, useState } from 'react';
import { Keyword, KeywordService } from '@/lib/services/keyword.service';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

// Draggable imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
    kw: Keyword;
    idx: number;
    onEdit: (kw: Keyword) => void;
    onDelete: (id: string) => void;
}

function SortableRow({ kw, idx, onEdit, onDelete }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: kw.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        position: 'relative' as const,
    };

    return (
        <tr 
            ref={setNodeRef} 
            style={style} 
            className={`hover:bg-slate-50/50 transition-colors group ${isDragging ? 'bg-white shadow-xl opacity-80' : ''}`}
        >
            <td className="p-5 w-12 text-center">
                <button 
                    {...attributes} 
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-primary transition-colors"
                >
                    <GripVertical className="w-5 h-5" />
                </button>
            </td>
            <td className="p-5 w-16 text-center font-bold text-slate-400">{idx + 1}</td>
            <td className="p-5 font-semibold text-slate-700">{kw.word}</td>
            <td className="p-5 text-center">
                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${kw.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {kw.isActive ? 'Hiển thị' : 'Đang ẩn'}
                </span>
            </td>
            <td className="p-5 text-right">
                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(kw)}
                        className="p-2 text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(kw.id)}
                        className="p-2 text-danger bg-danger/10 hover:bg-danger hover:text-white rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function KeywordsPage() {
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
    const [formData, setFormData] = useState({ word: '', isActive: true });

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchKeywords = async () => {
        try {
            const data = await KeywordService.getAllAdmin();
            setKeywords(data);
        } catch (error) {
            toast.error('Không thể tải danh sách từ khóa');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords();
    }, []);

    const handleOpenModal = (kw?: Keyword) => {
        if (kw) {
            setEditingKeyword(kw);
            setFormData({ word: kw.word, isActive: kw.isActive });
        } else {
            setEditingKeyword(null);
            setFormData({ word: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.word.trim()) {
            toast.error('Vui lòng nhập từ khóa');
            return;
        }

        try {
            if (editingKeyword) {
                await KeywordService.update(editingKeyword.id, {
                    word: formData.word.trim(),
                    isActive: formData.isActive
                });
                toast.success('Cập nhật thành công');
            } else {
                await KeywordService.create({
                    word: formData.word.trim(),
                    isActive: formData.isActive,
                    order: keywords.length
                });
                toast.success('Thêm mới thành công');
            }
            setIsModalOpen(false);
            fetchKeywords();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa từ khóa này?')) return;
        try {
            await KeywordService.delete(id);
            toast.success('Xóa thành công');
            fetchKeywords();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa');
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = keywords.findIndex(k => k.id === active.id);
            const newIndex = keywords.findIndex(k => k.id === over.id);
            
            const newKeywords = arrayMove(keywords, oldIndex, newIndex);
            setKeywords(newKeywords);

            try {
                await KeywordService.reorder(newKeywords.map(k => k.id));
                toast.success('Cập nhật thứ tự thành công');
            } catch (e) {
                toast.error('Lỗi khi lưu thứ tự mới');
                fetchKeywords(); // Revert on fail
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Quản lý Từ khóa nổi bật</h1>
                    <p className="text-slate-500 text-sm mt-1">Giữ biểu tượng nắm kéo để sắp xếp thứ tự hiển thị</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Thêm từ khóa
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[11px] font-black text-slate-400 tracking-wider">
                                    <th className="p-5 w-12 text-center"></th>
                                    <th className="p-5 w-16 text-center">STT</th>
                                    <th className="p-5">Từ khóa</th>
                                    <th className="p-5 w-32 text-center">Trạng thái</th>
                                    <th className="p-5 w-32 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <SortableContext 
                                    items={keywords.map(k => k.id)} 
                                    strategy={verticalListSortingStrategy}
                                >
                                    {keywords.map((kw, idx) => (
                                        <SortableRow 
                                            key={kw.id} 
                                            kw={kw} 
                                            idx={idx} 
                                            onEdit={handleOpenModal}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </SortableContext>
                                {keywords.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                                            Chưa có từ khóa nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </DndContext>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-800">
                                {editingKeyword ? 'Cập nhật từ khóa' : 'Thêm từ khóa mới'}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 pb-2">Từ khóa gơi ý</label>
                                <input
                                    type="text"
                                    value={formData.word}
                                    onChange={e => setFormData({ ...formData, word: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                    placeholder="Vd: Làm việc từ xa"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                                <span className="text-sm font-bold text-slate-600">Hiển thị trên trang chủ</span>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-md active:scale-95"
                            >
                                Lưu lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
