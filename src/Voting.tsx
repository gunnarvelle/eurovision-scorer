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

const Voting = () => {
  const [votes, setVotes]: [{ [point: number]: string }, any] = useState([]);
  const [points, setPoints] = useState([12, 10, 8, 7, 6, 5, 4, 3, 2, 1]);
  const [userName, setUserName] = useState("");

  const [nextPoint, ...restPoints] = points;
  const [postSucceeded, setPostSucceeded] = useState(false);

  const countriesWithVotes: string[] = Object.keys(votes).map(parseInt).map(
    (p: number) => votes[p]
  );
  const awardedAllPoints = !nextPoint;

  const scoresIsEmpty = Object.keys(votes).length === 0;
  return (
    <div>
      <div>
        <table>
          <tbody>
            {Object.entries(votes)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .reverse()
              .map(([point, country]) => (
                <tr key={point.toString() + country}>
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
              disabled={countriesWithVotes.includes(c)}
              onClick={() => {
                setPoints(restPoints);
                setVotes({ ...votes, [nextPoint]: c });
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
                if (votes) {
                  const lastScore = Math.max(
                    ...Object.keys(votes).map(parseInt)
                  );
                  const { [lastScore]: foo, ...otherVotes } = votes;
                  const point = lastScore || 0;

                  setPoints([point, ...points]);
                  setVotes(otherVotes);
                }
              }}
            >
              Undo
            </button>
          </div>
          {awardedAllPoints && (
            <React.Fragment>
              <div className="nes-field">
                <label>Navnet ditt</label>
                <input
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="nes-input"
                  type="text"
                />
              </div>
              <button
                className="nes-btn is-primary"
                onClick={async () => {
                  db.collection("user-votes")
                    .add({
                      userName,
                      votes
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
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Voting;
