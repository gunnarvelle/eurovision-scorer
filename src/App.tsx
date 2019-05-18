import React from "react";
import "./App.css";
import Voting from "./Voting";
import ScoreBoard from "./ScoreBoard";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Route path={process.env.PUBLIC_URL + "/"} component={Voting} />
        <Route
          path={process.env.PUBLIC_URL + "/aoeu"}
          exact
          component={ScoreBoard}
        />
      </Router>
    </div>
  );
};

export default App;
