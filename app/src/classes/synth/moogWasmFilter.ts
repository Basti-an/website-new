import * as Tone from "tone";
import { ModSource } from "../../types/modSource";
import { SynthInputs } from "../../types/synthinputs";

export default class MoogWasmFilter {
  filter: AudioWorkletNode;

  inputs: SynthInputs;

  frequency: Tone.Signal<"frequency">;

  detune: Tone.Signal<"cents">;

  filterConnect: Tone.Add;

  private frequencyInputScale: Tone.Scale;

  constructor(wasmFilterNode: AudioWorkletNode) {
    this.filter = wasmFilterNode;

    this.frequency = new Tone.Signal(0, "frequency");
    this.detune = new Tone.Signal(0, "cents");

    // setup filter to accept a modulation source
    this.filterConnect = new Tone.Add();
    this.frequency.connect(this.filterConnect);
    this.detune.connect(this.filterConnect.addend);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.filterConnect.connect(this.filter.parameters.get("cutoff")!);

    this.frequencyInputScale = new Tone.ScaleExp(0, 1200 * 5, Math.E);
    this.frequencyInputScale.connect(this.detune);

    this.inputs = {
      frequency: (input: ModSource) => input.connect(this.frequencyInputScale),
    };
  }
}
