import React, { useEffect } from 'react';
import LandingPage from './modules/letterjam/LandingPage';



function App() {
  useEffect(() => {
    document.title = "LetterJam - V2";
  }, []);

  return (
    <LandingPage />
  );
}

export default App;
