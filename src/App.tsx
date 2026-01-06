import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JournalEntry from './pages/JournalEntry';
import Dashboard from './pages/DashBoard';
import Dosha from './pages/Dosha';
import DoshaResultPage from './pages/DoshaResultPage';
import YogaPoses from './pages/YogaPoses';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout을 부모 Route로 설정 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/journal/" element={<JournalEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dosha" element={<Dosha />} />
          <Route path="/dosha/result" element={<DoshaResultPage />} />
          <Route path="/yoga-poses" element={<YogaPoses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
