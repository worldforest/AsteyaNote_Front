'use client';

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { X, Plus, Camera, Video, Save } from 'lucide-react';

// 타입 정의
interface YogaEntry {
  date: string;
  time: string;
  studio: string;
  teacher: string;
  asanas: string[];
  yogaStyle: string;
  feelings: string;
  notes: string;
  photos: File[];
  videos: File[];
}

interface AutocompleteItem {
  id: string;
  name: string;
}

const JournalEntryPage: React.FC = () => {
  const navigate = useNavigate()


  // 상태 관리
  const [entry, setEntry] = useState<YogaEntry>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    studio: '',
    teacher: '',
    asanas: [],
    yogaStyle: '',
    feelings: '',
    notes: '',
    photos: [],
    videos: [],
  });

  const [asanaInput, setAsanaInput] = useState('');
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 자동완성 데이터 (실제로는 API에서 가져올 데이터)
  const studios: AutocompleteItem[] = [
    { id: '1', name: '광흥창 복샘요가' },
    { id: '2', name: '마포 복샘요가' },
    { id: '3', name: '서래마을 요가스튜디오' },
  ];

  const teachers: AutocompleteItem[] = [
    { id: '1', name: '(봉)미선' },
    { id: '2', name: '원장' },
    { id: '3', name: '보윤' },
    { id: '4', name: '하경' },
  ];

  const yogaStyles = ['하타', '빈야사', '아쉬탕가', '인요가', '파워요가', '리스토러티브'];

  const commonAsanas = [
    '다운독',
    '플랭크',
    '차투랑가',
    '워리어1',
    '워리어2',
    '트라이앵글',
    '트리포즈',
    '차일드포즈',
    '코브라',
    '비둘기자세',
  ];

  // 아사나 태그 추가
  const handleAddAsana = () => {
    if (asanaInput.trim() && !entry.asanas.includes(asanaInput.trim())) {
      setEntry({ ...entry, asanas: [...entry.asanas, asanaInput.trim()] });
      setAsanaInput('');
    }
  };

  // 아사나 태그 삭제
  const handleRemoveAsana = (asana: string) => {
    setEntry({ ...entry, asanas: entry.asanas.filter((a) => a !== asana) });
  };

  // Enter 키로 태그 추가
  const handleAsanaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAsana();
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'photos' | 'videos'
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setEntry({ ...entry, [type]: [...entry[type], ...fileArray] });
    }
  };

  // 파일 삭제
  const handleRemoveFile = (index: number, type: 'photos' | 'videos') => {
    const updatedFiles = entry[type].filter((_, i) => i !== index);
    setEntry({ ...entry, [type]: updatedFiles });
  };

  // 저장 핸들러
  const handleSave = async () => {
    setIsSaving(true);
    // 실제로는 API 호출
    const formData = new FormData();
    formData.append('date', entry.date);
    formData.append('time', entry.time);
    formData.append('studio', entry.studio);
    formData.append('teacher', entry.teacher);
    formData.append('asanas', JSON.stringify(entry.asanas));
    formData.append('yogaStyle', entry.yogaStyle);
    formData.append('feelings', entry.feelings);
    formData.append('notes', entry.notes);
    
    entry.photos.forEach((photo) => formData.append('photos', photo));
    entry.videos.forEach((video) => formData.append('videos', video));

    // 시뮬레이션
    setTimeout(() => {
      setIsSaving(false);
      alert('기록이 저장되었습니다!');
      // 전체 기록 페이지로 이동
    //   router.push('/DashBoard');
    }, 1000);
    navigate("/dashboard")
  };

  return (
    <div className="min-h-screen bg-[#FAFEF5] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-2">요가 일기</h1>
          <p className="text-gray-600">오늘의 수련을 기록해보세요</p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* 1단계: 기본 컨텍스트 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">수업 정보</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜
                </label>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간
                </label>
                <input
                  type="time"
                  value={entry.time}
                  onChange={(e) => setEntry({ ...entry, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요가원
              </label>
              <input
                type="text"
                list="studios"
                value={entry.studio}
                onChange={(e) => setEntry({ ...entry, studio: e.target.value })}
                placeholder="요가원을 선택하거나 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <datalist id="studios">
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선생님
              </label>
              <input
                type="text"
                list="teachers"
                value={entry.teacher}
                onChange={(e) => setEntry({ ...entry, teacher: e.target.value })}
                placeholder="선생님을 선택하거나 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <datalist id="teachers">
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.name} />
                ))}
              </datalist>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* 2단계: 수업 내용 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">수업 내용</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요가 스타일
              </label>
              <select
                value={entry.yogaStyle}
                onChange={(e) => setEntry({ ...entry, yogaStyle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="">선택하세요</option>
                {yogaStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아사나 (동작)
              </label>
              
              {/* 태그 입력창 */}
              <div className="relative">
                <input
                  type="text"
                  list="asanas"
                  value={asanaInput}
                  onChange={(e) => setAsanaInput(e.target.value)}
                  onKeyDown={handleAsanaKeyDown}
                  placeholder="동작을 입력하고 Enter를 누르세요"
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <button
                  onClick={handleAddAsana}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Plus size={20} className="text-gray-600" />
                </button>
              </div>
              
              <datalist id="asanas">
                {commonAsanas.map((asana) => (
                  <option key={asana} value={asana} />
                ))}
              </datalist>

              {/* 태그 표시 */}
              {entry.asanas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.asanas.map((asana) => (
                    <span
                      key={asana}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {asana}
                      <button
                        onClick={() => handleRemoveAsana(asana)}
                        className="hover:bg-green-200 rounded-full p-0.5 transition"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* 3단계: 주관적 경험 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">나의 경험</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                오늘 수업에서 느낀 점
              </label>
              <textarea
                value={entry.feelings}
                onChange={(e) => setEntry({ ...entry, feelings: e.target.value })}
                placeholder="신체적 변화, 감정, 어려웠던 점 등을 자유롭게 적어보세요"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기록하고 싶은 것
              </label>
              <textarea
                value={entry.notes}
                onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
                placeholder="선생님의 조언, 특별한 순간, 다음 목표 등을 적어보세요"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* 4단계: 멀티미디어 (선택사항) */}
          <section>
            <button
              onClick={() => setShowMediaSection(!showMediaSection)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <Plus size={20} />
              <span className="font-medium">사진 및 영상 추가 (선택사항)</span>
            </button>

            {showMediaSection && (
              <div className="mt-4 space-y-4">
                {/* 사진 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사진
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 transition">
                    <Camera size={20} className="text-gray-600" />
                    <span className="text-gray-600">사진 추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'photos')}
                      className="hidden"
                    />
                  </label>

                  {entry.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {entry.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveFile(index, 'photos')}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 영상 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    영상
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 transition">
                    <Video size={20} className="text-gray-600" />
                    <span className="text-gray-600">영상 추가</span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'videos')}
                      className="hidden"
                    />
                  </label>

                  {entry.videos.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {entry.videos.map((video, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {video.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index, 'videos')}
                            className="p-1 hover:bg-red-100 rounded-full transition"
                          >
                            <X size={16} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-400 to-lime-400 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? '저장 중...' : '기록 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryPage;
