import React, { useState, useEffect } from 'react';
import { 
    BadgeDto, 
    CreateBadgeDto, 
    UpdateBadgeDto 
} from '@shared/dto';
import { BadgeRuleType } from '@shared/enums';
import { badgeService } from '@/api/badgeService';
import { useToast } from '@/components/ui/Toast';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    XMarkIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const ManageBadgesPage = () => {
    const [badges, setBadges] = useState<BadgeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBadge, setEditingBadge] = useState<BadgeDto | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<CreateBadgeDto>>({
        name: '',
        description: '',
        icon: '🏆',
        ruleType: BadgeRuleType.TOTAL_SESSIONS,
        ruleValue: 10,
        points: 100
    });

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await badgeService.getAllBadges({ limit: '100' });
            if (response.data) {
                setBadges(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching badges:', error);
            showToast('Failed to load badges', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (badge: BadgeDto) => {
        setEditingBadge(badge);
        setFormData({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            ruleType: badge.ruleType,
            ruleValue: badge.ruleValue,
            points: badge.points
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this badge?')) return;

        try {
            await badgeService.deleteBadge(id);
            showToast('Badge deleted successfully', 'success');
            fetchBadges();
        } catch (error) {
            console.error('Error deleting badge:', error);
            showToast('Failed to delete badge', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingBadge) {
                await badgeService.updateBadge(editingBadge.id, formData as UpdateBadgeDto);
                showToast('Badge updated successfully', 'success');
            } else {
                await badgeService.createBadge(formData as CreateBadgeDto);
                showToast('Badge created successfully', 'success');
            }
            
            setShowForm(false);
            setEditingBadge(null);
            resetForm();
            fetchBadges();
        } catch (error) {
            console.error('Error saving badge:', error);
            showToast('Failed to save badge', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: '🏆',
            ruleType: BadgeRuleType.TOTAL_SESSIONS,
            ruleValue: 10,
            points: 100
        });
    };

    const handleCheckBadges = async () => {
        try {
            const response = await badgeService.checkBadges();
            if (response.data) {
                showToast(response.message || 'Badge check completed', 'success');
            }
        } catch (error) {
            console.error('Error checking badges:', error);
            showToast('Failed to run badge check', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Badges</h1>
                    <p className="text-gray-400">Create and manage achievement badges</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCheckBadges}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Run Badge Check
                    </button>
                    <button
                        onClick={() => {
                            setEditingBadge(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Badge
                    </button>
                </div>
            </div>

            {/* Badges List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading badges...</p>
                ) : badges.length === 0 ? (
                    <p className="text-gray-400">No badges found.</p>
                ) : (
                    badges.map((badge) => (
                        <div key={badge.id} className="card p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{badge.icon || '🏆'}</span>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{badge.name}</h3>
                                        <p className="text-sm text-primary">{badge.points} pts</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(badge)}
                                        className="p-2 hover:bg-dark-lighter rounded-lg text-gray-400 hover:text-white transition-colors"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(badge.id)}
                                        className="p-2 hover:bg-dark-lighter rounded-lg text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm flex-grow">
                                {badge.description}
                            </p>

                            <div className="pt-4 border-t border-dark-lighter">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Rule</p>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">{badge.ruleType.replace(/_/g, ' ')}</span>
                                    <span className="font-mono text-primary">≥ {badge.ruleValue}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-dark-lighter flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingBadge ? 'Edit Badge' : 'Create New Badge'}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Badge Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input w-full h-24 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="input w-full"
                                        placeholder="🏆"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Points
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                        className="input w-full"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Rule Type
                                    </label>
                                    <select
                                        value={formData.ruleType}
                                        onChange={(e) => setFormData({ ...formData, ruleType: e.target.value as BadgeRuleType })}
                                        className="input w-full"
                                    >
                                        {Object.values(BadgeRuleType).map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Threshold Value
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.ruleValue}
                                        onChange={(e) => setFormData({ ...formData, ruleValue: parseFloat(e.target.value) || 0 })}
                                        className="input w-full"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingBadge ? 'Update Badge' : 'Create Badge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBadgesPage;
