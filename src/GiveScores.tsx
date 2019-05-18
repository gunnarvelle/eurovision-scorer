import React, { useState } from "react";
import CountryButton from "./CountryButton";

const countries = [
  "Cyprus",
  "Montenegro",
  "Finland",
  "Poland",
  "Slovenia",
  "Czech Republic",
  "Hungary",
  "Belarus",
  "Serbia",
  "Belgium",
  "Georgia",
  "Australia",
  "Iceland",
  "Estonia",
  "Portugal",
  "Greece",
  "San Marino"
];

const GiveScores = () => {
  const [scores, setScores]: [[number, string][], any] = useState([]);
  const [points, setPoints] = useState([12, 10, 8, 7, 6, 5, 4, 3, 2, 1]);

  const [nextPoint, ...restPoints] = points;
  const [postSucceeded, setPostSucceeded] = useState(false);

  const scoredCountries = scores.map(([, c]) => c);
  const awardedAllPoints = !nextPoint;

  const scoresIsEmpty = scores.length === 0;
  return (
    <div>
      <div>
        <table>
          <tbody>
            {scores.map(([point, country]) => (
              <tr key={point + country}>
                <td>{point}</td>
                <td>{country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nextPoint && (
        <div>
          <em>
            {nextPoint} points
            <br /> goes to
          </em>
        </div>
      )}
      {nextPoint && (
        <div>
          {countries.map(c => (
            <CountryButton
              key={c}
              disabled={scoredCountries.includes(c)}
              onClick={() => {
                setPoints(restPoints);
                scores.push([nextPoint, c]);
                setScores(scores);
              }}
              name={c}
            />
          ))}
        </div>
      )}
      {postSucceeded ? (
        <div>Sendte inn!</div>
      ) : (
        <React.Fragment>
          <div>
            <button
              disabled={scoresIsEmpty}
              className="nes-btn is-error"
              onClick={() => {
                if (scores) {
                  const lastScore = scores.pop();
                  const [point] = lastScore || [0];

                  setPoints([point, ...points]);
                  setScores([...scores]);
                }
              }}
            >
              Undo
            </button>
          </div>
          {awardedAllPoints && (
            <button
              className="nes-btn is-primary"
              onClick={async () => {
                fetch("https://jsonplaceholder.typicode.com/posts", {
                  method: "POST"
                }).then(() => {
                  setPostSucceeded(true);
                });
              }}
            >
              Send inn
            </button>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default GiveScores;
