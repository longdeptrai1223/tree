import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileHandler from './pages/FileHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/open-file" element={<FileHandler />} />
        {/* ... existing routes ... */}
      </Routes>
    </Router>
  );
}

export default App; 