import React from "react";
import "./App.css";
import Voting from "./Voting";
import ScoreBoard from "./ScoreBoard";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Route path="/" exact component={Voting} />
        <Route path="/aoeu" component={ScoreBoard} />
      </Router>
    </div>
  );
};

export default App;
