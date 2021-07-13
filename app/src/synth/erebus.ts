import * as Tone from "tone";
import { ModSource } from "../types/modSource.d";
import Delay from "./delay";
import Envelope from "./envelope";
import Filter from "./filter";
import LFO from "./lfo";
import Oscillators from "./oscillators";

type TargetFunction = (input: ModSource) => void;

export default class Erebus {
  filter: Filter;

  oscillators: Oscillators;

  lfo: LFO;

  envelope: Envelope;

  delay: Delay;

  ampEnv: Tone.AmplitudeEnvelope;

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

    this.noise = new Tone.Noise("white").start();
    this.noise.volume.value = -55;
    this.ampEnv = new Tone.AmplitudeEnvelope({
      attack: 0.42,
      decay: 0,
      sustain: 1.0,
      release: 0.5,
    });
    this.output = new Tone.Gain(0.9);
    this.limiter = new Tone.Limiter(-6);

    this.distortion = new Tone.Distortion(0.0666);

    // lfo, envelope -> filter freq
    this.filter.inputs.frequency(this.lfo.lfo);
    this.filter.inputs.frequency(this.envelope.output);

    // osc´s + white noise -> filter
    this.noise.connect(this.filter.filter);
    this.oscillators.oscMixOut.connect(this.filter.filter);

    // filter -> amp in
    this.filter.filter.connect(this.ampEnv);

    // amp out + distortion -> delay
    this.ampEnv.connect(this.delay.delay);
    this.distortion.connect(this.delay.delay);

    // delay -> limiter -> output
    this.delay.delay.connect(this.limiter);
    this.limiter.connect(this.output);
    this.output.toDestination();

    // configure internal cv routing
    this.lfoTarget = this.filter.inputs.frequency;
  }
}
