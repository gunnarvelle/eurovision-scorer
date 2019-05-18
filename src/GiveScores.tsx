import React, { useState } from "react";
import CountryButton from "./CountryButton";
import * as firebase from "firebase";

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

const firebaseConfig = {
  apiKey: "AIzaSyDMXD0-q5wcY-YxL0CuIS86ibvQEeGpp8c",
  authDomain: "eurovision-voter.firebaseapp.com",
  databaseURL: "https://eurovision-voter.firebaseio.com",
  projectId: "eurovision-voter",
  storageBucket: "eurovision-voter.appspot.com",
  messagingSenderId: "685398369353",
  appId: "1:685398369353:web:d9f10d520a5cf65a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

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
                db.collection("user-votes")
                  .add({
                    foo: "bar"
                  })
                  .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    setPostSucceeded(true);
                  })
                  .catch(function(error) {
                    console.error("Error adding document: ", error);
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
