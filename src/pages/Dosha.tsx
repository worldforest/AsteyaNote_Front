import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, Home } from 'lucide-react';
import { doshaQuestions, doshaInfo } from '../data/doshaQuestions';
import type { DoshaType } from '../types/dosha';

const Dosha: React.FC = () => {
    const navigate = useNavigate();
    const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState<DoshaType>('vata');

    const toggleQuestion = (questionId: number) => {
        const newChecked = new Set(checkedQuestions);
        if (newChecked.has(questionId)) {
            newChecked.delete(questionId);
        } else {
            newChecked.add(questionId);
        }
        setCheckedQuestions(newChecked);
    };

    const calculateResults = () => {
        let vataCount = 0;
        let pittaCount = 0;
        let kaphaCount = 0;

        checkedQuestions.forEach(id => {
            const question = doshaQuestions.find(q => q.id === id);
            if (question) {
                if (question.type === 'vata') vataCount++;
                else if (question.type === 'pitta') pittaCount++;
                else if (question.type === 'kapha') kaphaCount++;
            }
        });

        return { vata: vataCount, pitta: pittaCount, kapha: kaphaCount };
    };

    const handleSubmit = () => {
        const results = calculateResults();
        let dominant: DoshaType = 'vata';

        if (results.pitta > results.vata && results.pitta > results.kapha) {
            dominant = 'pitta';
        } else if (results.kapha > results.vata && results.kapha > results.pitta) {
            dominant = 'kapha';
        }

        // 결과를 state로 전달하면서 결과 페이지로 이동
        navigate('/dosha/result', { state: { ...results, dominant } });
    };

    const vataQuestions = doshaQuestions.filter(q => q.type === 'vata');
    const pittaQuestions = doshaQuestions.filter(q => q.type === 'pitta');
    const kaphaQuestions = doshaQuestions.filter(q => q.type === 'kapha');

    const getQuestionsForTab = () => {
        if (activeTab === 'vata') return vataQuestions;
        if (activeTab === 'pitta') return pittaQuestions;
        return kaphaQuestions;
    };

    const results = calculateResults();
    const totalChecked = checkedQuestions.size;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main Content */}
            <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-sm">홈으로</span>
                    </button>

                    <h1 className="text-5xl md:text-6xl font-extralight text-gray-800 mb-4">
                        도샤 진단
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        나에게 해당하는 문항을 체크하세요
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">진행률</span>
                        <span className="text-sm font-medium text-gray-700">{totalChecked} / 90</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                            style={{ width: `${(totalChecked / 90) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`${doshaInfo.vata.backgroundColor} rounded-xl p-4 border ${doshaInfo.vata.borderColor}`}>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">{doshaInfo.vata.name}</h3>
                        <p className="text-2xl font-semibold text-gray-800">{results.vata}</p>
                    </div>
                    <div className={`${doshaInfo.pitta.backgroundColor} rounded-xl p-4 border ${doshaInfo.pitta.borderColor}`}>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">{doshaInfo.pitta.name}</h3>
                        <p className="text-2xl font-semibold text-gray-800">{results.pitta}</p>
                    </div>
                    <div className={`${doshaInfo.kapha.backgroundColor} rounded-xl p-4 border ${doshaInfo.kapha.borderColor}`}>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">{doshaInfo.kapha.name}</h3>
                        <p className="text-2xl font-semibold text-gray-800">{results.kapha}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('vata')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'vata'
                            ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                            : 'bg-white/70 text-gray-700 hover:bg-white'
                            }`}
                    >
                        바타 (Vata)
                    </button>
                    <button
                        onClick={() => setActiveTab('pitta')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'pitta'
                            ? 'bg-gradient-to-r from-red-400 to-orange-400 text-white shadow-lg'
                            : 'bg-white/70 text-gray-700 hover:bg-white'
                            }`}
                    >
                        피타 (Pitta)
                    </button>
                    <button
                        onClick={() => setActiveTab('kapha')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'kapha'
                            ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white shadow-lg'
                            : 'bg-white/70 text-gray-700 hover:bg-white'
                            }`}
                    >
                        카파 (Kapha)
                    </button>
                </div>

                {/* Questions List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
                    <h2 className="text-2xl font-medium text-gray-800 mb-6">
                        {doshaInfo[activeTab].name} 체질 ({doshaInfo[activeTab].nameEn})
                    </h2>

                    <div className="space-y-3">
                        {getQuestionsForTab().map((question) => {
                            const isChecked = checkedQuestions.has(question.id);
                            return (
                                <button
                                    key={question.id}
                                    onClick={() => toggleQuestion(question.id)}
                                    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${isChecked
                                        ? `${doshaInfo[activeTab].backgroundColor} ${doshaInfo[activeTab].borderColor} border-2 shadow-md`
                                        : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                                        }`}
                                >
                                    {isChecked ? (
                                        <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 ${activeTab === 'vata' ? 'text-blue-500' :
                                            activeTab === 'pitta' ? 'text-red-500' :
                                                'text-green-500'
                                            }`} />
                                    ) : (
                                        <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-left text-gray-800">{question.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={totalChecked === 0}
                    className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${totalChecked === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:scale-105'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        결과 확인하기
                        <ArrowRight className="w-5 h-5" />
                    </span>
                </button>

                {/* Info Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    체크가 가장 많은 것이 본인의 주된 체질입니다
                </p>
            </div>
        </div>
    );
};

export default Dosha;
