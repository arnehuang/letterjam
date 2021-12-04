import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import io from 'socket.io-client'


function App() {
  React.useEffect(() => {
    document.title = "LetterJam - V2";
  }, []);
  return (
    <div className="App" >
      <NavBar />
      <header className="App-header">
        <img src="/img/full_logo.png" className="App-logo" alt="logo2" />
        <p>
          Discover your word. Help others do the same. 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>      
    </div>
  );
}

export default App;
