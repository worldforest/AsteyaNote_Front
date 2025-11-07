import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import JournalEntry from './pages/JournalEntry';
import Dashboard from './pages/DashBoard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout을 부모 Route로 설정 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/journal/" element={<JournalEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
