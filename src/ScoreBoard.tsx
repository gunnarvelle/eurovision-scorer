import React, { useState, useEffect } from "react";
import { db } from "./Firebase";

type OneUsersVotes = { userName: string; votes: { [point: number]: string } };
type AllVotes = OneUsersVotes[];
type FinalScore = { [country: string]: number };

const ScoreBoard = () => {
  const [allVotes, setAllVotes]: [AllVotes, any] = useState([]);

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

  const finalScore = allVotes.reduce(
    (soFar: FinalScore, ouv: OneUsersVotes) => {
      try {
        return Object.entries<string>(ouv.votes)
          .map<[string, number]>(([points, country]) => [
            country,
            parseInt(points)
          ])
          .reduce<FinalScore>(
            (tempAccum: FinalScore, [country, points]) => ({
              ...tempAccum,
              [country]: (tempAccum[country] || 0) + points
            }),
            soFar
          );
      } catch (e) {
        return soFar;
      }
    },
    {}
  );
  console.log(finalScore);

  console.log(allVotes);
  return (
    <ol>
      {Object.entries<number>(finalScore)
        .sort(([, points1], [, points2]) => points2 - points1)
        .map(([country, score]: [string, number]) => (
          <li>
            {country} {score}
          </li>
        ))}
    </ol>
  );
};

export default ScoreBoard;
