import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CountryButton from "./CountryButton";
import GiveScores from "./GiveScores";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GiveScores />
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
};

export default App;
