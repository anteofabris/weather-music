import React, { useState } from "react";

interface SecondsDialProps {
  seconds: number;
  setSeconds: (value: number) => void;
}

const SecondsDial: React.FC<SecondsDialProps> = ({ seconds, setSeconds }) => {
  const [value, setValue] = useState(3600);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);
    setSeconds(newValue);
  };

  return (
    <>
      <label htmlFor="seconds">{value} Seconds</label>
      <input
        style={{ width: "60vw" }}
        type="range"
        min={1}
        max={3600}
        value={value}
        onChange={handleChange}
      />
    </>
  );
};

export default SecondsDial;
