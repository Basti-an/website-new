import * as Tone from "tone";
import { ModSource } from "../../types/modSource.d";
import Delay from "./delay";
import Envelope from "./envelope";
import Filter from "./filter";
import LFO from "./lfo";
import Oscillators from "./oscillators";
import VCA from "./vca";
import MoogWasmFilter from "./moogWasmFilter";

export type Output = {
  label: string;
  output: ModSource;
  connectedWith?: number;
  noAttenuator?: boolean;
};

export type Input = {
  label: string;
  connectInput: (output: ModSource) => void;
};

async function setupFilter(audioContext: AudioContext) {
  await audioContext.audioWorklet.addModule("https://localhost:8080/wasm-worklet-processor.js", {});
  const ladderNode = new AudioWorkletNode(audioContext, "wasm-worklet-processor", {
    channelCount: 2,
    channelInterpretation: "speakers",
    channelCountMode: "explicit",
  });

  //  Gets WeAssembly bytcode from file
  const response = await fetch("https://localhost:8080/filterKernel.wasm");
  const byteCode = await response.arrayBuffer();

  //  Sends bytecode to the AudioWorkletProcessor for instanciation
  ladderNode.port.postMessage({ webassembly: byteCode });
  window.addEventListener("processorerror", (event) => {
    console.error(event);
  });

  return ladderNode;
}

export default class Erebus {
  filter: Filter;

  oscillators: Oscillators;

  lfo: LFO;

  envelope: Envelope;

  delay: Delay;

  vca: VCA;

  inputs: Input[];

  outputs: Output[];

  analyser: Tone.Analyser;

  audioContext: AudioContext;

  keyboard: {
    cv1: Tone.Signal<"frequency">;
    cv2: Tone.Signal<"frequency">;
    output1: Tone.Scale;
    output2: Tone.Scale;
  };

  private noise: Tone.Noise;

  private limiter: Tone.Limiter;

  wasmMoogFilter: MoogWasmFilter | undefined;

  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext({ latencyHint: 0 });
    window.audioContext = this.audioContext;
    Tone.setContext(this.audioContext);

    // reduce latency
    Tone.context.lookAhead = 0.003; // 3ms;

    // wasmMoogFilter is initialized async in init()
    this.wasmMoogFilter = undefined;

    this.filter = new Filter();
    this.oscillators = new Oscillators();
    this.lfo = new LFO();
    this.envelope = new Envelope();
    this.delay = new Delay();
    this.vca = new VCA();

    this.noise = new Tone.Noise("white").start();
    this.noise.volume.value = -55;
    this.limiter = new Tone.Limiter(-12);

    this.analyser = new Tone.Analyser("waveform", 4096);

    // lfo, envelope -> filter freq
    // this.filter.inputs.frequency(this.lfo.output);
    // this.filter.inputs.frequency(this.envelope.filterOutput);

    // osc´s + white noise -> filter
    // this.noise.connect(this.filter.filter);
    // this.oscillators.oscMixOut.connect(this.filter.filter);

    // filter -> amp in

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
      output1: new Tone.Scale(0, 1),
      output2: new Tone.Scale(0, 1),
    };

    // scale down the frequency range to [0, 1] approximately for output
    const multiply1 = new Tone.Multiply(1 / 220);
    const multiply2 = new Tone.Multiply(1 / 220);
    this.keyboard.cv1.connect(multiply1);
    this.keyboard.cv2.connect(multiply2);
    multiply1.connect(this.keyboard.output1);
    multiply2.connect(this.keyboard.output2);

    this.outputs = [
      { label: "ENV", output: this.envelope.output },
      { label: "LFO", output: this.lfo.output, connectedWith: 2 },
      { label: "LFO2", output: this.lfo.output2, connectedWith: 5 },
      { label: "CV1", output: this.keyboard.output1, noAttenuator: true },
      { label: "CV2", output: this.keyboard.output2, noAttenuator: true },
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
          this.wasmMoogFilter?.inputs.frequency(output);
        },
      },
      {
        label: "ECHO",
        connectInput: (output: ModSource) => {
          window.erebus.delay.inputs.delay(output);
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

  setOutputs(outputs: Output[]) {
    this.outputs = outputs;
  }

  async init() {
    const audioWorkletNode = await setupFilter(this.audioContext);
    this.wasmMoogFilter = new MoogWasmFilter(audioWorkletNode);

    this.oscillators.output.connect(this.wasmMoogFilter.filter);
    // this.noise.connect(this.wasmMoogFilter);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    // this.wasmMoogFilter.inputs.frequency(this.lfo.output);
    this.wasmMoogFilter.inputs.frequency(this.envelope.filterOutput);

    Tone.connect(this.wasmMoogFilter.filter, this.vca.ampEnv);
    // this.filter.filter.connect(this.vca.ampEnv);

    // amp out + distortion -> delay
    this.vca.output.connect(this.delay.delay);

    // delay -> limiter -> output
    this.delay.delay.connect(this.limiter);
    this.limiter.connect(this.analyser);
    this.analyser.toDestination();

    this.keyboard.cv1.connect(this.oscillators.osc1.frequency);
    this.keyboard.cv2.connect(this.oscillators.osc2.frequency);
  }
}
