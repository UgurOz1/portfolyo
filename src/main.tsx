import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Blog from './pages/Blog.tsx'
import Admin from './pages/Admin.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
