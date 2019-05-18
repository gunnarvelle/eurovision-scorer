import React, { useState } from "react";
import CountryButton from "./CountryButton";
import { db } from "./Firebase";

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

const Voting = () => {
  const [votes, setVotes]: [{ [point: number]: string }, any] = useState([]);
  const [points, setPoints] = useState([12, 10, 8, 7, 6, 5, 4, 3, 2, 1]);
  const [userName, setUserName] = useState("");

  const [nextPoint, ...restPoints] = points;
  const [postSucceeded, setPostSucceeded] = useState(false);

  const countriesWithVotes: string[] = Object.values(votes);
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
      {!postSucceeded && (
        <div>
          <button
            disabled={scoresIsEmpty}
            className={`nes-btn is-error ${scoresIsEmpty && "is-disabled"}`}
            onClick={() => {
              if (votes) {
                const lastScore = Math.min(
                  ...Object.keys(votes).map(a => parseInt(a))
                );
                const { [lastScore]: foo, ...otherVotes } = votes;
                const point = lastScore || 0;

                setPoints([point, ...points]);
                setVotes(otherVotes);
              }
            }}
          >
            Angre
          </button>
        </div>
      )}
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
                className={`nes-btn is-primary ${!userName && "is-disabled"}`}
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
