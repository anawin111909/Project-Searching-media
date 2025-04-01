import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage'; // เพิ่มตรงนี้

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} /> {/* ✅ เพิ่มตรงนี้ */}
      </Routes>
    </Router>
  </StrictMode>
);
