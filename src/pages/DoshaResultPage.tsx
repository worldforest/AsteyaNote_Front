import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { doshaInfo } from '../data/doshaQuestions';
import type { DoshaType, DoshaResult } from '../types/dosha';

const DoshaResultPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state as DoshaResult;

    if (!result) {
        navigate('/dosha');
        return null;
    }

    const { vata, pitta, kapha, dominant } = result;
    const total = vata + pitta + kapha;

    const doshaDescriptions = {
        vata: {
            title: '바타 (Vata) 체질',
            subtitle: '바람의 에너지',
            description: '바타 체질은 움직임과 변화의 에너지를 가지고 있습니다. 창의적이고 활동적이며, 빠른 사고력을 가지고 있습니다.',
            characteristics: [
                '창의적이고 상상력이 풍부합니다',
                '빠른 학습 능력과 적응력을 가지고 있습니다',
                '활동적이고 에너지가 넘칩니다',
                '감정 변화가 빠르고 예민한 편입니다',
            ],
            recommendations: [
                '규칙적인 생활 습관을 유지하세요',
                '따뜻한 환경을 선호하고 충분한 휴식을 취하세요',
                '안정감을 주는 요가 자세를 연습하세요',
                '영양가 있고 따뜻한 음식을 섭취하세요',
            ],
        },
        pitta: {
            title: '피타 (Pitta) 체질',
            subtitle: '불의 에너지',
            description: '피타 체질은 변형과 대사의 에너지를 가지고 있습니다. 열정적이고 결단력이 있으며, 강한 리더십을 보입니다.',
            characteristics: [
                '목표 지향적이고 결단력이 강합니다',
                '논리적이고 분석적인 사고를 합니다',
                '열정적이고 경쟁심이 강합니다',
                '강한 소화력과 왕성한 식욕을 가집니다',
            ],
            recommendations: [
                '시원한 환경을 유지하고 과열을 피하세요',
                '차분함을 유지하고 스트레스를 관리하세요',
                '쿨다운 효과가 있는 요가 자세를 연습하세요',
                '시원하고 가벼운 음식을 섭취하세요',
            ],
        },
        kapha: {
            title: '카파 (Kapha) 체질',
            subtitle: '물과 땅의 에너지',
            description: '카파 체질은 구조와 안정의 에너지를 가지고 있습니다. 차분하고 인내심이 강하며, 강한 체력을 보입니다.',
            characteristics: [
                '차분하고 안정적인 성격입니다',
                '인내심이 강하고 끈기가 있습니다',
                '강한 체력과 지구력을 가집니다',
                '충성심이 강하고 배려심이 깊습니다',
            ],
            recommendations: [
                '활동적인 생활을 유지하고 운동을 규칙적으로 하세요',
                '따뜻하고 건조한 환경을 선호하세요',
                '활력을 주는 요가 자세를 연습하세요',
                '가볍고 따뜻한 음식을 섭취하세요',
            ],
        },
    };

    const dominantInfo = doshaDescriptions[dominant];
    const dominantColor = doshaInfo[dominant].color;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main Content */}
            <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-6 animate-bounce">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extralight text-gray-800 mb-4">
                        진단 결과
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        당신의 도샤 체질 분석 결과입니다
                    </p>
                </div>

                {/* Results Summary */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {[
                            { type: 'vata' as DoshaType, count: vata },
                            { type: 'pitta' as DoshaType, count: pitta },
                            { type: 'kapha' as DoshaType, count: kapha },
                        ].map(({ type, count }) => {
                            const isDominant = type === dominant;
                            return (
                                <div
                                    key={type}
                                    className={`relative ${doshaInfo[type].backgroundColor} rounded-2xl p-6 border-2 transition-all ${isDominant ? `${doshaInfo[type].borderColor} ring-4 ring-opacity-30` : doshaInfo[type].borderColor
                                        }`}
                                >
                                    {isDominant && (
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">{doshaInfo[type].name}</h3>
                                    <p className="text-4xl font-bold text-gray-800 mb-2">{count}</p>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${doshaInfo[type].color} transition-all duration-500`}
                                            style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        {total > 0 ? Math.round((count / total) * 100) : 0}%
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className={`bg-gradient-to-r ${dominantColor} rounded-2xl p-8 text-white text-center`}>
                        <h2 className="text-3xl font-bold mb-2">{dominantInfo.title}</h2>
                        <p className="text-xl opacity-90">{dominantInfo.subtitle}</p>
                    </div>
                </div>

                {/* Dominant Dosha Description */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">체질 특성</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{dominantInfo.description}</p>

                    <div className="space-y-3">
                        {dominantInfo.characteristics.map((char, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dominantColor} mt-2 flex-shrink-0`}></div>
                                <p className="text-gray-700">{char}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">생활 권장사항</h3>

                    <div className="space-y-3">
                        {dominantInfo.recommendations.map((rec, index) => (
                            <div key={index} className={`${doshaInfo[dominant].backgroundColor} rounded-xl p-4 border ${doshaInfo[dominant].borderColor}`}>
                                <div className="flex items-start gap-3">
                                    <span className="font-semibold text-gray-800">{index + 1}.</span>
                                    <p className="text-gray-700">{rec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    {/* Primary: Yoga Poses Button */}
                    <button
                        onClick={() => navigate(`/yoga-poses?dosha=${dominant}`)}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        추천 요가 자세 보기
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Secondary Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/dosha')}
                            className="flex-1 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            다시 진단하기
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoshaResultPage;
