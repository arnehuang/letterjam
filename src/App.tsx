import React, { useEffect } from 'react';
import LandingPage from './modules/letterjam/LandingPage';
import PlayerPage from './modules/letterjam/PlayerPage';
import ResetPage from './modules/letterjam/ResetPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  console.log(process.env.REACT_APP_API_URL);
  console.log("abc123");

  useEffect(() => {
    document.title = "LetterJam";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}>          
        </Route>
        <Route path="/player/:id" element={<PlayerPage/>}>
        </Route>
        <Route path="/reset" element={<ResetPage/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
