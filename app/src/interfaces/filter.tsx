import * as Tone from "tone";
import { Signal } from "tone";
import { ModSource } from "../types/modSource.d";

export interface IFilter {
  filter: Tone.Filter;
  frequency: Signal<"frequency">;
  inputs: {
    frequency: (input: ModSource) => void;
  };
}
