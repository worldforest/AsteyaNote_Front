// import React, { useState, useEffect } from 'react';
// import { Plus, Edit2, Trash2, Calendar, MapPin, User, Activity, Heart } from 'lucide-react';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;