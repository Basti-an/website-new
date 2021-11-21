import * as Tone from "tone";
import { ModSource } from "./modSource.d";

export type InputFunction = (input: ModSource) => void;
export type SynthInputs = Record<string, InputFunction>;
