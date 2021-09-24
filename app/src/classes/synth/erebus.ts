import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import Delay from "./delay";
import Envelope from "./envelope";
import Filter from "./filter";
import LFO from "./lfo";
import Oscillators from "./oscillators";
import VCA from "./vca";

type TargetFunction = (input: ModSource) => void;
export type Output = { label: string; output: ModSource; connectedWith?: number };
export type Input = {
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

  keyboard: { cv1: Tone.Signal<"frequency">; cv2: Tone.Signal<"frequency"> };

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
    // this.filter.inputs.frequency(this.lfo.output);
    // this.oscillators.osc1.inputs.pulsewidth(this.lfo.output2);
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

    // setup keyboard
    this.keyboard = {
      cv1: new Tone.Signal({
        value: "C2",
        units: "frequency",
      }),
      cv2: new Tone.Signal({
        value: "C2",
        units: "frequency",
      }),
    };
    this.keyboard.cv1.connect(this.oscillators.osc1.frequency);
    this.keyboard.cv2.connect(this.oscillators.osc2.frequency);

    // configure internal cv routing
    this.lfoTarget = this.filter.inputs.frequency;

    this.outputs = [
      { label: "ENV", output: this.envelope.output },
      { label: "LFO", output: this.lfo.output, connectedWith: 2 },
      { label: "LFO2", output: this.lfo.output2, connectedWith: 5 },
    ];

    this.inputs = [
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
        label: "VCF",
        connectInput: (output: ModSource) => {
          this.filter.inputs.frequency(output);
        },
      },
      // {
      //  TODO: in order to change cv, I will have to scale the input [0,1] into like 3-5 octaves
      //        so the scaling will have to be something like [0,1] -> [1200 (cents) per octave]

      //   label: "CV",
      //   connectInput: (output: ModSource) => {
      //     this.filter.inputs.frequency(output);
      //   },
      // },
      {
        label: "ECHO",
        connectInput: (output: ModSource) => {
          window.erebus.delay.inputs.delayTime(output);
        },
      },
      // {
      //   label: "GATE",
      //   connectInput: (output: ModSource) => {
      //     this.ampEnv.triggerAttack???;
      //   },
      // },
      {
        label: "LFO/R",
        connectInput: (output: ModSource) => {
          this.lfo.inputs.lforate(output);
        },
      },
      {
        label: "PW",
        connectInput: (output: ModSource) => {
          this.oscillators.osc1.inputs.pulsewidth(output);
        },
      },
      // {
      //   label: "VCA",
      //   connectInput: (output: ModSource) => {
      //     this.vca.inputs.volume(output);
      //   },
      // },
    ];
  }
}
