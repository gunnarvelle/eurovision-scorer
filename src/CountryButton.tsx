import React from "react";
import nameToCountryCode from "./nameToCountryCode";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  disabled: boolean;
};

// eslint-disable-next-line
export default ({ name, onClick, disabled }: Props) => {
  const flag = `flags/${nameToCountryCode[name].toLowerCase()}.png`;
  return (
    <button
      type="button"
      className={`nes-btn is-primary ${disabled && "is-disabled"}`}
      disabled={disabled}
      onClick={onClick}
    >
      <img src={flag} className="flag" alt={`Flag of ${name}`} />
      <span className="nes-text">{name}</span>
    </button>
  );
};
