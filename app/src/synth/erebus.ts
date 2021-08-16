import * as Tone from "tone";
import { ModSource } from "../types/modSource.d";
import Delay from "./delay";
import Envelope from "./envelope";
import Filter from "./filter";
import LFO from "./lfo";
import Oscillators from "./oscillators";
import VCA from "./vca";

type TargetFunction = (input: ModSource) => void;

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

  private noise: Tone.Noise;

  private limiter: Tone.Limiter;

  private distortion: Tone.Distortion;

  constructor() {
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

    // lfo, envelope -> filter freq
    this.filter.inputs.frequency(this.lfo.output);
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
    this.output.toDestination();

    // configure internal cv routing
    this.lfoTarget = this.filter.inputs.frequency;
  }
}
