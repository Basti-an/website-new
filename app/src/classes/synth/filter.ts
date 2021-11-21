import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import { SynthInputs } from "../../types/synthinputs";

export default class Filter {
  filter: Tone.Filter;

  inputs: SynthInputs;

  frequency: Tone.Signal<"frequency">;

  private frequencyInputScale: Tone.Scale;

  constructor(frequency = 700, Q = 2.4) {
    this.filter = new Tone.Filter({
      frequency,
      Q,
      rolloff: -12,
    });

    this.frequency = new Tone.Signal(0, "frequency");

    // setup filter to accept a modulation source
    const filterConnect = new Tone.Add();
    this.frequency.connect(filterConnect.addend);
    filterConnect.connect(this.filter.frequency);

    this.frequencyInputScale = new Tone.Scale(0, 5000);
    this.frequencyInputScale.connect(this.filter.detune);

    this.inputs = {
      frequency: (input: ModSource) => input.connect(this.frequencyInputScale),
    };
  }
}
