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

  const scoredCountries = scores.map(([_, c]) => c);

  return (
    <div>
      <ul>
        {scores.map(([point, country]) => (
          <li>
            {point} {country}
          </li>
        ))}
      </ul>
      {nextPoint && (
        <React.Fragment>
          {countries
            .filter(c => !scoredCountries.includes(c))
            .map(c => (
              <CountryButton
                onClick={() => {
                  setPoints(restPoints);
                  scores.push([nextPoint, c]);
                  setScores(scores);
                }}
                name={c}
              />
            ))}
        </React.Fragment>
      )}
      <div>
        {scores.length > 0 && (
          <button
            onClick={() => {
              const lastScore = scores.pop();
              if (lastScore) {
                const [point, junk] = lastScore;
                points.unshift(point);
                setPoints(points);
                setScores(scores);
              }
            }}
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
};

export default GiveScores;
