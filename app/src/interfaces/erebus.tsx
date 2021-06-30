import * as Tone from "tone";
import { ModSource } from "../types/modSource.d";
import { IFilter } from "./filter";
import { IOscillators } from "./oscillators";

export interface IErebus {
  filter: IFilter;
  lfo: Tone.LFO;
  ampEnv: Tone.AmplitudeEnvelope;
  feedbackDelay: Tone.FeedbackDelay;
  noise: Tone.Noise;
  lfoConnect: (input: ModSource) => void;
  output: Tone.Gain;
  oscillators: IOscillators;
  // switchClick: {
  //   up: Tone.Player;
  //   up2: Tone.Player;
  //   down: Tone.Player;
  //   down2: Tone.Player;
  // };
}
