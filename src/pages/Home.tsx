import React from 'react';
import { useNavigate } from "react-router-dom"
import { Flower2, BookOpen, Sunrise, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-yellow-50 to-green-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-lime-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Logo/Icon */}
        <div className="mb-8 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-300 to-yellow-300 rounded-full blur-xl opacity-50"></div>
            <div className="relative">
              <h1 className="text-6xl">🧘‍♀️</h1>
              {/* <Flower2 className="w-16 h-16 text-lime-600" strokeWidth={1.5} /> */}
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-extralight text-gray-800 text-center mb-4 tracking-wide">
          Asteya Note<br/>
        </h1>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-lime-400 to-transparent"></div>
          <p className="text-xl md:text-2xl text-gray-600 font-light italic">
            Yoga Journal
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent via-lime-400 to-transparent"></div>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-12 font-light leading-relaxed">
          매일 분주하게 살아가며 <br/>스스로에게 소중한 것들에 소홀하지 않은가요?<br/>
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => navigate("/journal")}
          className="group relative px-10 py-4 bg-gradient-to-r from-lime-400 to-yellow-400 text-gray-800 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 mb-16">
          <span className="relative z-10 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            기록하기
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          
          {/* Card 1 */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-lime-100">
            <div className="bg-gradient-to-br from-lime-100 to-yellow-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sunrise className="w-7 h-7 text-lime-700" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-3">나의 시간</h3>
            <p className="text-gray-600 font-light leading-relaxed">
             과거의 후회나 남의 삶을 탐하며, '지금 여기'의 나에게 소홀히 했던 순간
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-yellow-100">
            <div className="bg-gradient-to-br from-yellow-100 to-lime-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-yellow-700" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-3">나의 에너지</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              이미 가진 것을 보지 못하고, 부족함을 채우려 불필요하게 탐냈던 마음
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
            <div className="bg-gradient-to-br from-green-100 to-lime-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-green-700" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-3">나의 진실</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              세상의 기준에 맞추려, 침묵시키고 외면했던 솔직한 내면의 소리
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 font-light italic text-lg">
            가장 진실한 나를 마주하고, <br/>소중한 것을 잃지 않기 위한 시간을 기록하세요.
          </p>
          {/* <p className="text-gray-400 text-sm mt-2">- 인도 속담</p> */}
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;