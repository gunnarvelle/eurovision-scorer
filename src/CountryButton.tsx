import React from "react";
import nameToCountryCode from "./nameToCountryCode";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  disabled: boolean;
};

// @ts-ignore
export default ({ name, onClick, disabled }: Props) => {
  const flag = `/flags/${nameToCountryCode[name].toLowerCase()}.png`;
  return (
    <button disabled={disabled} onClick={onClick}>
      <img src={flag} alt={`Flag of ${name}`} />
      {name}
    </button>
  );
};
