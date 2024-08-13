import React from 'react';
import { BrowserRouter, Route, Routes, Redirect  } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import DashboardEnglish from './pages/dashboardEN';
import Manual from './pages/manual';
import ManualEnglish from './pages/manualEN';
import HomeEnglish from './pages/homeEN'

function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path = '/' element = { <Home /> } />
        <Route path = '/dashboard' element = { <Dashboard /> } />
        <Route path = '/en/dashboard' element = { <DashboardEnglish /> } />
        <Route path = '/en/manual' element = { < ManualEnglish/> } />
        <Route path = '/manual' element = { < Manual/> } />
        <Route path = '/en' element = { < HomeEnglish/> } />
      </Routes>     
    </BrowserRouter>
  );
}
export default App;