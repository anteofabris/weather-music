import * as Tone from "tone";

const makeChorus = (options: any) =>
  new Tone.Chorus(options).toDestination().start();

const makeAutoFilter = (options: any) =>
  new Tone.AutoFilter(options).toDestination().start();

const makeLimiter = (db: number) => new Tone.Limiter(db).toDestination();

const makeAmpEnv = (options: any) =>
  new Tone.AmplitudeEnvelope(options).toDestination();

const makeAutoPanner = (options: any) =>
  new Tone.AutoPanner(options).toDestination().start();

export { makeChorus, makeAutoFilter, makeLimiter, makeAmpEnv, makeAutoPanner };
