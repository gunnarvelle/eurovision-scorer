import React from "react";
import "./App.css";
import DndVoting from "./DndVoting";
import ScoreBoard from "./ScoreBoard";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Route path="/" exact component={DndVoting} />
        <Route path="/score" component={ScoreBoard} />
      </Router>
    </div>
  );
};

export default App;
