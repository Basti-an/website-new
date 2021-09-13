import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import Delay from "./delay";
import Envelope from "./envelope";
import Filter from "./filter";
import LFO from "./lfo";
import Oscillators from "./oscillators";
import VCA from "./vca";

type TargetFunction = (input: ModSource) => void;
type Output = { label: string; output: ModSource; connectedWith?: number };
type Input = {
  label: string;
  connectInput: (output: ModSource) => void;
};

export default class Erebus {
  filter: Filter;

  oscillators: Oscillators;

  lfo: LFO;

  envelope: Envelope;

  delay: Delay;

  vca: VCA;

  lfoTarget: TargetFunction | undefined;

  envelopeTarget: TargetFunction | undefined;

  output: Tone.Gain;

  inputs: Input[];

  outputs: Output[];

  analyser: Tone.Analyser;

  private noise: Tone.Noise;

  private limiter: Tone.Limiter;

  private distortion: Tone.Distortion;

  constructor() {
    // reduce latency
    Tone.context.lookAhead = 0.003; // 3ms;

    this.filter = new Filter();
    this.oscillators = new Oscillators();
    this.lfo = new LFO();
    this.envelope = new Envelope();
    this.delay = new Delay();
    this.vca = new VCA();

    this.noise = new Tone.Noise("white").start();
    this.noise.volume.value = -55;
    this.output = new Tone.Gain(0.9);
    this.limiter = new Tone.Limiter(-6);

    this.distortion = new Tone.Distortion(0.0777);

    this.analyser = new Tone.Analyser("waveform", 4096);

    // lfo, envelope -> filter freq
    this.filter.inputs.frequency(this.lfo.output);
    this.oscillators.osc1.inputs.pulsewidth(this.lfo.output2);
    this.filter.inputs.frequency(this.envelope.filterOutput);

    // osc´s + white noise -> filter
    this.noise.connect(this.filter.filter);
    this.oscillators.oscMixOut.connect(this.filter.filter);

    // filter -> amp in
    this.filter.filter.connect(this.vca.ampEnv);

    // amp out + distortion -> delay
    this.vca.output.connect(this.delay.delay);
    this.distortion.connect(this.delay.delay);

    // delay -> limiter -> output
    this.delay.delay.connect(this.limiter);
    this.limiter.connect(this.output);
    this.output.connect(this.analyser);
    this.analyser.toDestination();

    // configure internal cv routing
    this.lfoTarget = this.filter.inputs.frequency;

    this.outputs = [
      { label: "ENV", output: this.envelope.output },
      { label: "LFO", output: this.lfo.output, connectedWith: 0 },
      { label: "LFO2", output: this.lfo.output2, connectedWith: 5 },
    ];

    this.inputs = [
      {
        label: "VCF",
        connectInput: (output: ModSource) => {
          this.filter.inputs.frequency(output);
        },
      },
      {
        label: "OSC1",
        connectInput: (output: ModSource) => {
          this.oscillators.osc1.inputs.frequency(output);
        },
      },
      {
        label: "OSC2",
        connectInput: (output: ModSource) => {
          this.oscillators.osc2.inputs.frequency(output);
        },
      },
      {
        label: "ECHO",
        connectInput: (output: ModSource) => {
          window.erebus.delay.inputs.delayTime(output);
        },
      },
      {
        label: "LFO/R",
        connectInput: (output: ModSource) => {
          this.lfo.inputs.lforate(output);
        },
      },
      // {
      //   label: "VCA",
      //   connectInput: (output: ModSource) => {
      //     this.vca.inputs.volume(output);
      //   },
      // },
      {
        label: "PW",
        connectInput: (output: ModSource) => {
          this.oscillators.osc1.inputs.pulsewidth(output);
        },
      },
    ];
  }
}
