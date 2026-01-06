import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, X, Sparkles, Trash2, Search, Loader2 } from 'lucide-react';
import type { DoshaType } from '../types/dosha';
import type { UserYogaPose, YogaPose } from '../types/yogaPose';
import {
    getAllYogaPoses,
    addCustomYogaPose,
    deleteCustomYogaPose,
    initializeDefaultPoses
} from '../utils/yogaPoseStorage';
import { doshaInfo } from '../data/doshaQuestions';

type FilterType = 'all' | DoshaType;

const YogaPoses: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [poses, setPoses] = useState<UserYogaPose[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPose, setNewPose] = useState<Omit<YogaPose, 'id'>>({
        name: '',
        nameEn: '',
        description: '',
        doshaType: 'vata',
        benefits: [''],
    });

    // URL 쿼리에서 도샤 타입 가져오기
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const doshaParam = params.get('dosha') as DoshaType | null;
        if (doshaParam && ['vata', 'pitta', 'kapha'].includes(doshaParam)) {
            setFilter(doshaParam);
        }
    }, [location.search]);

    // 요가 자세 불러오기 및 초기화
    useEffect(() => {
        const initAndLoad = async () => {
            setLoading(true);
            try {
                // Firestore가 비어있으면 기본 데이터 초기화 시도
                await initializeDefaultPoses();
                await loadPoses();
            } catch (error) {
                console.error('Initialization failed:', error);
            } finally {
                setLoading(false);
            }
        };

        initAndLoad();
    }, []);

    const loadPoses = async () => {
        const allPoses = await getAllYogaPoses();
        setPoses(allPoses);
    };

    // 도샤 필터링
    const doshaFilteredPoses = filter === 'all'
        ? poses
        : poses.filter(pose => pose.doshaType === filter);

    // 검색어 필터링
    const filteredPoses = searchQuery.trim() === ''
        ? doshaFilteredPoses
        : doshaFilteredPoses.filter(pose =>
            pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pose.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleAddPose = async () => {
        if (!newPose.name || !newPose.description) {
            alert('자세 이름과 설명을 입력해주세요.');
            return;
        }

        const filteredBenefits = newPose.benefits.filter(b => b.trim() !== '');
        const poseToAdd = {
            ...newPose,
            benefits: filteredBenefits.length > 0 ? filteredBenefits : ['건강 증진'],
        };

        try {
            await addCustomYogaPose(poseToAdd);
            await loadPoses();
            setShowAddModal(false);
            resetNewPose();
        } catch (error) {
            alert('자세 추가 중 오류가 발생했습니다.');
        }
    };

    const handleDeletePose = async (id: string) => {
        if (window.confirm('이 자세를 삭제하시겠습니까?')) {
            try {
                await deleteCustomYogaPose(id);
                await loadPoses();
            } catch (error) {
                alert('자세 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const resetNewPose = () => {
        setNewPose({
            name: '',
            nameEn: '',
            description: '',
            doshaType: 'vata',
            benefits: [''],
        });
    };

    const updateBenefit = (index: number, value: string) => {
        const newBenefits = [...newPose.benefits];
        newBenefits[index] = value;
        setNewPose({ ...newPose, benefits: newBenefits });
    };

    const addBenefitField = () => {
        setNewPose({ ...newPose, benefits: [...newPose.benefits, ''] });
    };

    const removeBenefitField = (index: number) => {
        const newBenefits = newPose.benefits.filter((_, i) => i !== index);
        setNewPose({ ...newPose, benefits: newBenefits.length > 0 ? newBenefits : [''] });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">데이터를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main Content */}
            <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-sm">홈으로</span>
                    </button>

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extralight text-gray-800 mb-4">
                        요가 자세
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        도샤 체질에 맞는 요가 자세를 찾아보세요
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="자세 이름으로 검색..."
                            className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs + Add Button */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex gap-2 flex-1 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === 'all'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'bg-white/70 text-gray-700 hover:bg-white'
                                }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setFilter('vata')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === 'vata'
                                ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                                : 'bg-white/70 text-gray-700 hover:bg-white'
                                }`}
                        >
                            바타
                        </button>
                        <button
                            onClick={() => setFilter('pitta')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === 'pitta'
                                ? 'bg-gradient-to-r from-red-400 to-orange-400 text-white shadow-lg'
                                : 'bg-white/70 text-gray-700 hover:bg-white'
                                }`}
                        >
                            피타
                        </button>
                        <button
                            onClick={() => setFilter('kapha')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === 'kapha'
                                ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-lg'
                                : 'bg-white/70 text-gray-700 hover:bg-white'
                                }`}
                        >
                            카파
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        자세 추가
                    </button>
                </div>

                {/* Poses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPoses.map((pose) => (
                        <div
                            key={pose.id}
                            className={`relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 ${doshaInfo[pose.doshaType].borderColor
                                }`}
                        >
                            {/* Delete button for custom poses */}
                            {pose.isCustom && (
                                <button
                                    onClick={() => handleDeletePose(pose.id)}
                                    className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                                    title="삭제"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            )}

                            {/* Dosha Badge */}
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${doshaInfo[pose.doshaType].backgroundColor} text-gray-700`}>
                                {doshaInfo[pose.doshaType].name}
                            </div>

                            {/* Pose Name */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {pose.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 italic">
                                {pose.nameEn}
                            </p>

                            {/* Description */}
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                {pose.description}
                            </p>

                            {/* Benefits */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-700">효과:</h4>
                                <ul className="space-y-1">
                                    {pose.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${doshaInfo[pose.doshaType].color} mt-1.5 flex-shrink-0`}></div>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Custom Badge */}
                            {pose.isCustom && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <span className="text-xs text-purple-600 font-medium">사용자 추가 자세</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPoses.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">표시할 요가 자세가 없습니다.</p>
                        <p className="text-gray-400 text-sm mt-2">새로운 자세를 추가해보세요!</p>
                    </div>
                )}
            </div>

            {/* Add Pose Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-semibold text-gray-800">새로운 자세 추가</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewPose();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Pose Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    자세 이름 (한글) *
                                </label>
                                <input
                                    type="text"
                                    value={newPose.name}
                                    onChange={(e) => setNewPose({ ...newPose, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                                    placeholder="예: 전사 자세"
                                />
                            </div>

                            {/* Pose Name English */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    자세 이름 (영문)
                                </label>
                                <input
                                    type="text"
                                    value={newPose.nameEn}
                                    onChange={(e) => setNewPose({ ...newPose, nameEn: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                                    placeholder="예: Warrior Pose"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    설명 *
                                </label>
                                <textarea
                                    value={newPose.description}
                                    onChange={(e) => setNewPose({ ...newPose, description: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors min-h-[100px]"
                                    placeholder="자세에 대한 설명을 입력하세요"
                                />
                            </div>

                            {/* Dosha Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    도샤 체질 *
                                </label>
                                <div className="flex gap-2">
                                    {(['vata', 'pitta', 'kapha'] as DoshaType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setNewPose({ ...newPose, doshaType: type })}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${newPose.doshaType === type
                                                ? `bg-gradient-to-r ${doshaInfo[type].color} text-white shadow-lg`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {doshaInfo[type].name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    효과
                                </label>
                                {newPose.benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={benefit}
                                            onChange={(e) => updateBenefit(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                                            placeholder={`효과 ${index + 1}`}
                                        />
                                        {newPose.benefits.length > 1 && (
                                            <button
                                                onClick={() => removeBenefitField(index)}
                                                className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5 text-red-600" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addBenefitField}
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    효과 추가
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewPose();
                                }}
                                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddPose}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '추가하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YogaPoses;
