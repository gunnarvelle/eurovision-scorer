import React from "react";
import "./App.css";
import Voting from "./Voting";
import DndVoting from "./DndVoting";
import ScoreBoard from "./ScoreBoard";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Route path="/" exact component={DndVoting} />
        <Route path="/aoeu" component={ScoreBoard} />
        <Route path="/old" component={Voting} />
      </Router>
    </div>
  );
};

export default App;
