import React from "react";
import "./App.css";
import GiveScores from "./GiveScores";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GiveScores />
      </header>
    </div>
  );
};

export default App;
