import React, { useState, useEffect } from "react";
import { db } from "./Firebase";
import countryList from "./participatingCountries";

type OneUsersVotes = { userName: string; votes: { [point: number]: string } };
type AllVotes = OneUsersVotes[];
type VotingState = {
  voteTally: FinalScore;
  lastVote: [string, number];
  votingUserName: string;
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
          .reduce<VotingState>(
            (tempAccum: VotingState, [country, points]) => ({
              ...tempAccum,
              voteTally: {
                ...tempAccum.voteTally,
                [country]: (tempAccum.voteTally[country] || 0) + points
              }
            }),
            soFar
          );
      } catch (e) {
        return soFar;
      }
    },
    {
      voteTally: countryList.reduce((soFar, a) => ({ ...soFar, [a]: 0 }), {}),
      lastVote: ["", 0],
      votingUserName: ""
    }
  );
  console.log(votingState);

  console.log(allVotes);
  return (
    <React.Fragment>
      <ol>
        {Object.entries<number>(votingState.voteTally)
          .sort(([, points1], [, points2]) => points2 - points1)
          .map(([country, score]: [string, number]) => (
            <li key={`${country} ${score}`}>
              {country} {score}
            </li>
          ))}
      </ol>
    </React.Fragment>
  );
};

export default ScoreBoard;
