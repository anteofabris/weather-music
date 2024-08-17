import * as Tone from "tone";
import Button from "react-bootstrap/Button";
import {
  getAttackLength,
  getRatesOfAttack,
  getPitchesPerHand,
  getAllowedPitches,
  getMidpoint,
  getHandCycle,
  getMomentPhraseLength,
  getPhraseLength,
  getChords,
  getRhythmicProfile,
  getPitchArrayDistribution,
  normalize,
} from "../extraction.ts";
import {
  makeChorus,
  makeAutoFilter,
  makeLimiter,
  makeAmpEnv,
  makeAutoPanner,
} from "../effects.ts";
import { useEffect, useState } from "react";

function SynthComponent({
  seconds,
  play,
}: {
  seconds: any;
  play: any;
}) {
  console.log("trying to play: ");

  //   useEffect(() => play(), [weatherData]);
  play(seconds);

  return <div></div>;
}

export default SynthComponent;
