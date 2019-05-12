import React from "react";
import nameToCountryCode from "./nameToCountryCode";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

// @ts-ignore
export default ({ name, onClick }: Props) => {
  const flag = `/flags/${nameToCountryCode[name].toLowerCase()}.png`;
  return (
    <button onClick={onClick}>
      <img src={flag} />
      {name}
    </button>
  );
};
