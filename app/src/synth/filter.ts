import * as Tone from "tone";
import { ModSource } from "../types/modSource.d";

export default class Filter {
  filter: Tone.Filter;

  inputs: { frequency: (input: ModSource) => void };

  frequency: Tone.Signal<"frequency">;

  constructor(frequency?: number, q?: number) {
    this.filter = new Tone.Filter({
      frequency: frequency ?? 700,
      Q: q ?? 2.4,
      rolloff: -12,
    });

    this.frequency = new Tone.Signal(0, "frequency");

    // setup filter to accept a modulation source
    const filterConnect = new Tone.Add();
    this.frequency.connect(filterConnect.addend);
    filterConnect.connect(this.filter.frequency);

    this.inputs = { frequency: (input: ModSource) => input.connect(this.filter.detune) };
  }
}
