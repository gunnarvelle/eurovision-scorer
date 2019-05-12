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

  const scoredCountries = scores.map(([, c]) => c);

  const scoresIsEmpty = scores.length === 0;
  return (
    <div>
      <div>
        <table>
          {scores.map(([point, country]) => (
            <tr key={point + country}>
              <td>{point}</td>
              <td>{country}</td>
            </tr>
          ))}
        </table>
      </div>
      {nextPoint && (
        <div>
          {nextPoint} points
          <br /> goes to
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
      <div>
        <button
          disabled={scoresIsEmpty}
          className="nes-btn is-error"
          onClick={() => {
            if (!scoresIsEmpty) {
              const lastScore = scores.pop() || [0];
              const [point] = lastScore;

              setPoints([point, ...points]);
              setScores([...scores]);
            }
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default GiveScores;
