'use client';

import React, { useState } from 'react';
import { Home, PenLine, TrendingUp, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';  // 👈 수정!

const Header: React.FC = () => {
  const navigate = useNavigate();  // 👈 수정!
  const location = useLocation();  // 👈 수정!
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '기록하기', path: '/journal', icon: PenLine },
    { name: '나의 여정', path: '/dashboard', icon: TrendingUp },
    { name: '쇼핑', path: '/shop', icon: ShoppingBag },
  ];

  const isActive = (path: string) => location.pathname === path;  // 👈 수정!

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div 
            onClick={() => navigate('/')}  // 👈 수정!
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-2xl">🧘‍♀️</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Asteya Note</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Yoga Journal</p>
            </div>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}  // 👈 수정!
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* 우측 액션 영역 */}
          <div className="flex items-center gap-3">
            {/* 빠른 기록 버튼 (데스크톱) */}
            <button
              onClick={() => navigate('/journal')}  // 👈 수정!
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-lime-400 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              <PenLine size={18} />
              <span>빠른 기록</span>
            </button>

            {/* 프로필 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <User size={24} className="text-gray-600" />
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate('/profile');  // 👈 수정!
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      내 프로필
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');  // 👈 수정!
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      설정
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);  // 👈 수정!
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    isActive(item.path)
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
              
              <button
                onClick={() => {
                  navigate('/journal');  // 👈 수정!
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-lime-400 text-white font-semibold rounded-lg mt-2"
              >
                <PenLine size={20} />
                <span>빠른 기록</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
