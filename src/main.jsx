import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import TestRoute from './pages/TestRoute.jsx'
import TermsPage from './pages/TermsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestRoute />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  </React.StrictMode>
)
