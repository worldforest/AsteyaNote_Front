import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Star } from 'lucide-react'

export default function YogaJournalEntry() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [duration, setDuration] = useState('')
  const [place, setPlace] = useState('')
  const [teacher, setTeacher] = useState('')
  const [condition, setCondition] = useState(50)
  const [asanas, setAsanas] = useState('')
  const [point, setPoint] = useState('')
  const [mind, setMind] = useState('')
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState('')
  const [achieved, setAchieved] = useState(false)
  const [rating, setRating] = useState(0)
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSave = () => {
    const entry = {
      date,
      duration,
      place,
      teacher,
      condition,
      asanas,
      point,
      mind,
      comment,
      tags,
      achieved,
      rating,
      photo: photo?.name || '',
    }
    console.log('Saved Entry:', entry)
    alert('일기가 저장되었습니다.')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">🧘‍♀️ 요가 성장 일기</h1>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>📅 날짜</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>⏰ 수련 시간</Label>
              <Input placeholder="예: 60분" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div>
              <Label>🏠 수련 장소</Label>
              <Input placeholder="예: 복샘요가 / 집" value={place} onChange={(e) => setPlace(e.target.value)} />
            </div>
            <div>
              <Label>🧑‍🏫 지도 강사</Label>
              <Input placeholder="선택 사항" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>🌤️ 컨디션 ({condition}%)</Label>
            <Slider value={[condition]} onValueChange={(val) => setCondition(val[0])} max={100} step={10} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label>🧘‍♂️ 오늘 한 아사나</Label>
            <Textarea placeholder="예: 비라바드라아사나 II, 나타라자아사나" value={asanas} onChange={(e) => setAsanas(e.target.value)} />
          </div>
          <div>
            <Label>❤️ 오늘의 포인트</Label>
            <Textarea placeholder="수련 중 느낀 점, 집중한 부위 등" value={point} onChange={(e) => setPoint(e.target.value)} />
          </div>
          <div>
            <Label>💭 마음 상태 / 통찰</Label>
            <Textarea placeholder="오늘의 감정, 생각, 깨달음 등" value={mind} onChange={(e) => setMind(e.target.value)} />
          </div>
          <div>
            <Label>📚 배운 점 / 코멘트</Label>
            <Textarea placeholder="강사 피드백이나 개선할 점" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label>📸 사진 업로드</Label>
            <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>🗂️ 태그</Label>
            <Input placeholder="예: 힙오픈, 균형, 휴식" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>🔁 오늘 목표 달성 여부</Label>
            <Switch checked={achieved} onCheckedChange={setAchieved} />
          </div>
          <div>
            <Label>⭐ 평점</Label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  onClick={() => setRating(num)}
                  className={`w-6 h-6 cursor-pointer ${rating >= num ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleSave} className="px-8 py-2 text-lg">💾 저장</Button>
      </div>
    </div>
  )
}
