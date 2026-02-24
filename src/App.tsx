import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Education from './pages/Education';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <AssessmentProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/consejos" element={<Education />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AssessmentProvider>
  );
};

export default App;
