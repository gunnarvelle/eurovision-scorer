import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
import countryList from "./participatingCountries";
import nameToCountryCode from "./nameToCountryCode";

type OneUsersVotes = { userName: string; votes: { [point: number]: string } };
type AllVotes = OneUsersVotes[];
type VotingState = {
  voteTally: FinalScore;
  usersVotes: { [country: string]: number };
  votingUserName: string;
  myVoteStep: number;
};
type FinalScore = { [country: string]: number };

const ScoreBoard = () => {
  const [allVotes, setAllVotes]: [AllVotes, any] = useState([]);
  const [voteSteps, setVoteSteps]: [number, any] = useState(0);

  useEffect(() => {
    db.collection("user-votes")
      .get()
      .then(querySnapshot => {
        const scoresAndUsers: AllVotes = [];
        querySnapshot.forEach(d =>
          scoresAndUsers.push({
            userName: d.data().userName,
            votes: d.data().votes
          })
        );
        setAllVotes(scoresAndUsers);
      });
  }, []);

  const votingState: VotingState = allVotes.reduce(
    (soFar: VotingState, ouv: OneUsersVotes) => {
      try {
        return Object.entries<string>(ouv.votes)
          .map<[string, number]>(([points, country]) => [
            country,
            parseInt(points)
          ])
          .sort(([, points1], [, points2]) => points1 - points2)
          .reduce<VotingState>(
            (tempAccum: VotingState, [country, points]) =>
              tempAccum.myVoteStep >= voteSteps
                ? tempAccum
                : {
                    ...tempAccum,
                    voteTally: {
                      ...tempAccum.voteTally,
                      [country]: (tempAccum.voteTally[country] || 0) + points
                    },
                    usersVotes:
                      ouv.userName === tempAccum.votingUserName
                        ? { ...tempAccum.usersVotes, [country]: points }
                        : { [country]: points },
                    myVoteStep: tempAccum.myVoteStep + 1,
                    votingUserName: ouv.userName
                  },

            soFar
          );
      } catch (e) {
        return soFar;
      }
    },
    {
      voteTally: countryList.reduce((soFar, a) => ({ ...soFar, [a]: 0 }), {}),
      usersVotes: {},
      votingUserName: "",
      myVoteStep: 0
    }
  );
  console.log(votingState);

  console.log(allVotes);
  return (
    <div>
      <h1>Resultater</h1>
      <div>
        <button
          className={`nes-btn is-secondary`}
          onClick={() => setVoteSteps(voteSteps - 1)}
        >
          Tilbake
        </button>
        <button
          className={`nes-btn is-primary`}
          onClick={() => setVoteSteps(voteSteps + 1)}
        >
          Neste
        </button>
      </div>
      <div>Stemmene fra {votingState.votingUserName}</div>
      <div>
        <div style={{ width: "400px", margin: "0 auto" }}>
          <table
            className="nes-table is-bordered is-centered"
            style={{ background: "lightblue" }}
          >
            <tbody>
              {Object.entries<number>(votingState.voteTally)
                .sort(([, points1], [, points2]) => points2 - points1)
                .map(([country, score]: [string, number]) => {
                  const isLatestVote =
                    votingState.usersVotes[country] ===
                    Math.max(...Object.values(votingState.usersVotes));
                  const flag = `flags/${nameToCountryCode[
                    country
                  ].toLowerCase()}.png`;
                  return (
                    <tr
                      style={
                        isLatestVote
                          ? {
                              backgroundColor: "rgb(32, 156, 238)"
                            }
                          : {}
                      }
                      key={`${country} ${score}`}
                    >
                      <td>
                        <img
                          src={flag}
                          className="flag"
                          alt={`Flag of ${country}`}
                        />
                        {country}
                      </td>
                      <td>{votingState.usersVotes[country] || ""}</td>
                      <td>{score}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
