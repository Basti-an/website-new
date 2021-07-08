import * as Tone from "tone";
import { Scale, ScaleOptions } from "tone";

export type ModSource = Tone.LFO | Tone.Envelope | Scale<ScaleOptions>;
