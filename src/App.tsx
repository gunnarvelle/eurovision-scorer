import React from "react";
import "./App.css";
import Voting from "./Voting";
import ScoreBoard from "./ScoreBoard";

const App: React.FC = () => {
  return (
    <div className="App">
      <ScoreBoard />
      <Voting />
    </div>
  );
};

export default App;
