import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import { SynthInputs } from "../../types/synthinputs";

export default class VCA {
  ampEnv: Tone.AmplitudeEnvelope;

  output: Tone.Gain;

  inputs: SynthInputs;

  private inputSignal: Tone.Scale;

  constructor() {
    this.ampEnv = new Tone.AmplitudeEnvelope({
      attack: 0.42,
      decay: 0,
      sustain: 1.0,
      release: 0.5,
    });
    this.ampEnv.releaseCurve = "linear";

    this.output = new Tone.Gain(1.0);
    this.ampEnv.connect(this.output);

    this.inputSignal = new Tone.Scale(0, 0.42);

    // setup delay to accept modulation sources
    const volumeConnect = new Tone.Add();
    this.inputSignal.connect(volumeConnect.addend);
    volumeConnect.connect(this.output.gain);

    this.inputs = {
      volume: (input: ModSource) => input.connect(this.inputSignal),
    };
  }
}
