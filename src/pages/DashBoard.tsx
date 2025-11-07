'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Award, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  Target
} from 'lucide-react';

// 타입 정의
interface YogaEntry {
  id: string;
  date: string;
  time: string;
  studio: string;
  teacher: string;
  asanas: string[];
  yogaStyle: string;
  feelings: string;
  notes: string;
  satisfaction: number; // 1-5
  photos: string[];
  videos: string[];
}

interface AsanaProgress {
  name: string;
  count: number;
  lastPracticed: string;
  proficiency: number; // 0-100
}

type ViewMode = 'month' | 'studio' | 'asana';
type FilterType = 'all' | 'studio' | 'teacher' | 'style';

const Dashboard: React.FC = () => {
  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const [entries] = useState<YogaEntry[]>([
    {
      id: '1',
      date: '2025-11-05',
      time: '10:00',
      studio: '강남 요가센터',
      teacher: '김민지',
      asanas: ['다운독', '플랭크', '워리어1', '워리어2'],
      yogaStyle: '빈야사',
      feelings: '오늘은 특히 균형이 좋았어요. 워리어 자세에서 안정감을 느꼈습니다.',
      notes: '선생님께서 호흡에 집중하라고 하셨어요.',
      satisfaction: 5,
      photos: [],
      videos: []
    },
    {
      id: '2',
      date: '2025-11-03',
      time: '19:00',
      studio: '홍대 힐링 요가',
      teacher: '박서연',
      asanas: ['차일드포즈', '비둘기자세', '코브라'],
      yogaStyle: '인요가',
      feelings: '몸이 많이 풀렸어요. 스트레칭이 정말 필요했던 것 같습니다.',
      notes: '비둘기자세에서 고관절이 많이 열렸어요.',
      satisfaction: 4,
      photos: [],
      videos: []
    },
    {
      id: '3',
      date: '2025-11-01',
      time: '07:00',
      studio: '강남 요가센터',
      teacher: '김민지',
      asanas: ['플랭크', '차투랑가', '다운독', '업독'],
      yogaStyle: '아쉬탕가',
      feelings: '아침 수련이라 힘들었지만 개운했어요.',
      notes: '차투랑가 자세 교정을 받았습니다.',
      satisfaction: 4,
      photos: [],
      videos: []
    },
  ]);

  // 상태 관리
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // 2025년 11월
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEntry, setSelectedEntry] = useState<YogaEntry | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');

  // 통계 계산
  const stats = useMemo(() => {
    const totalSessions = entries.length;
    const totalAsanas = new Set(entries.flatMap(e => e.asanas)).size;
    const avgSatisfaction = entries.reduce((sum, e) => sum + e.satisfaction, 0) / entries.length;
    const thisMonthSessions = entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.getMonth() === currentDate.getMonth() && 
             entryDate.getFullYear() === currentDate.getFullYear();
    }).length;

    return {
      totalSessions,
      totalAsanas,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      thisMonthSessions,
      progressRate: (thisMonthSessions / 12) * 100 // 월 12회 목표 기준
    };
  }, [entries, currentDate]);

  // 아사나별 진도율 계산
  const asanaProgress = useMemo(() => {
    const asanaMap = new Map<string, AsanaProgress>();
    
    entries.forEach(entry => {
      entry.asanas.forEach(asana => {
        const existing = asanaMap.get(asana);
        if (existing) {
          existing.count += 1;
          existing.lastPracticed = entry.date > existing.lastPracticed ? entry.date : existing.lastPracticed;
        } else {
          asanaMap.set(asana, {
            name: asana,
            count: 1,
            lastPracticed: entry.date,
            proficiency: Math.min(100, Math.floor(Math.random() * 40) + 60) // 임시 완성도
          });
        }
      });
    });

    return Array.from(asanaMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [entries]);

  // 캘린더 생성
  const calendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    
    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentDate]);

  // 특정 날짜의 수업 찾기
  const getEntriesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.filter(e => e.date === dateStr);
  };

  // 월 변경
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // 스튜디오별 그룹화
  const groupByStudio = useMemo(() => {
    const studioMap = new Map<string, YogaEntry[]>();
    entries.forEach(entry => {
      const existing = studioMap.get(entry.studio);
      if (existing) {
        existing.push(entry);
      } else {
        studioMap.set(entry.studio, [entry]);
      }
    });
    return studioMap;
  }, [entries]);

  return (
    <div className="min-h-screen bg-[#FAFEF5] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-2">나의 요가 여정</h1>
          <p className="text-gray-600">수련 기록과 성장을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">이번 달 수련</span>
              <CalendarIcon size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.thisMonthSessions}회</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-lime-400 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, stats.progressRate)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">목표 12회 중 {stats.thisMonthSessions}회</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">총 수련 횟수</span>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalSessions}회</div>
            <p className="text-sm text-gray-500 mt-2">지속적으로 성장 중</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">마스터한 아사나</span>
              <Award size={20} className="text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalAsanas}개</div>
            <p className="text-sm text-gray-500 mt-2">다양한 동작 경험</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">평균 만족도</span>
              <Heart size={20} className="text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.avgSatisfaction}/5</div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Heart
                  key={i}
                  size={16}
                  className={i <= Math.round(Number(stats.avgSatisfaction)) ? 'fill-red-500 text-red-500' : 'text-gray-300'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 뷰 모드 선택 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'month'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            월별 보기
          </button>
          <button
            onClick={() => setViewMode('studio')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'studio'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            요가원별 보기
          </button>
          <button
            onClick={() => setViewMode('asana')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'asana'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            동작별 보기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2">
            {/* 월별 캘린더 뷰 */}
            {viewMode === 'month' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => changeMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {calendar.map((day, index) => {
                    const dayEntries = day ? getEntriesForDate(day) : [];
                    const hasEntry = dayEntries.length > 0;
                    
                    return (
                      <div
                        key={index}
                        className={`aspect-square border rounded-lg p-2 ${
                          day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                        } ${hasEntry ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
                        onClick={() => day && hasEntry && setSelectedEntry(dayEntries[0])}
                      >
                        {day && (
                          <>
                            <div className="text-sm font-medium text-gray-700">{day}</div>
                            {hasEntry && (
                              <div className="mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto" />
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                  {dayEntries.length}회
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 요가원별 뷰 */}
            {viewMode === 'studio' && (
              <div className="space-y-4">
                {Array.from(groupByStudio.entries()).map(([studio, studioEntries]) => (
                  <div key={studio} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{studio}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {studioEntries.length}회
                      </span>
                    </div>
                    <div className="space-y-2">
                      {studioEntries.map(entry => (
                        <div
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{entry.date}</div>
                            <div className="text-sm text-gray-600">{entry.teacher} · {entry.yogaStyle}</div>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Heart
                                key={i}
                                size={14}
                                className={i <= entry.satisfaction ? 'fill-red-500 text-red-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 동작별 뷰 */}
            {viewMode === 'asana' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  아사나 마스터 현황
                </h3>
                <div className="space-y-4">
                  {asanaProgress.map((asana, index) => (
                    <div key={asana.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-700">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{asana.name}</div>
                            <div className="text-xs text-gray-500">
                              {asana.count}회 수련 · 마지막: {asana.lastPracticed}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">
                            {asana.proficiency}%
                          </div>
                          <div className="text-xs text-gray-500">완성도</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-lime-400 h-2 rounded-full transition-all"
                          style={{ width: `${asana.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바: 일기 상세보기 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              {selectedEntry ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">수련 기록</h3>
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">날짜 및 시간</div>
                      <div className="font-medium text-gray-800">
                        {selectedEntry.date} {selectedEntry.time}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">요가원</div>
                      <div className="font-medium text-gray-800">{selectedEntry.studio}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">선생님</div>
                      <div className="font-medium text-gray-800">{selectedEntry.teacher}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">요가 스타일</div>
                      <div className="font-medium text-gray-800">{selectedEntry.yogaStyle}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">아사나</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.asanas.map(asana => (
                          <span
                            key={asana}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                          >
                            {asana}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">만족도</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Heart
                            key={i}
                            size={20}
                            className={i <= selectedEntry.satisfaction ? 'fill-red-500 text-red-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">느낀 점</div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedEntry.feelings}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">기록</div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedEntry.notes}
                      </div>
                    </div>

                    {selectedEntry.photos.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">사진</div>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEntry.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    캘린더에서 날짜를 선택하면<br />
                    상세 기록을 확인할 수 있습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
