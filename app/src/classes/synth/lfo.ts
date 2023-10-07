import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import { SynthInputs } from "../../types/synthinputs";

export default class LFO {
  lfo: Tone.LFO;

  output: Tone.Scale;

  output2: Tone.Scale;

  inputs: SynthInputs;

  lforate: Tone.Signal<"frequency">;

  private lforateInputScale: Tone.Scale;

  constructor(frequency?: number, min?: number, max?: number) {
    this.lfo = new Tone.LFO(frequency ?? 0.7, min ?? 0, max ?? 1);

    this.output = new Tone.Scale(0, 1);
    this.lfo.connect(this.output);
    this.output2 = new Tone.Scale(0, 1);
    this.lfo.connect(this.output2);

    this.lfo.start();

    this.lforate = new Tone.Signal(0, "frequency");

    // setup filter to accept a modulation source
    const adder = new Tone.Add();
    this.lforate.connect(adder.addend);
    adder.connect(this.lfo.frequency);

    this.lforateInputScale = new Tone.ScaleExp(0, 50, Math.E);
    this.lforateInputScale.connect(adder);

    this.inputs = {
      lforate: (input: ModSource) => input.connect(this.lforateInputScale),
    };
  }
}
