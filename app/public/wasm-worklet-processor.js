class WorkletProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "cutoff",
        defaultValue: 500,
        minValue: 20,
        maxValue: 20000,
        automationRate: "a-rate",
      },
    ];
  }

  constructor(options) {
    super(options);

    this.port.onmessage = (e) => {
      const key = Object.keys(e.data)[0];
      const value = e.data[key];

      switch (key) {
        case "webassembly":
          WebAssembly.instantiate(value, this.importObject).then((result) => {
            const exports = result.instance.exports;

            this.inputStart = exports.inputBufferPtr();
            this.outputStart = exports.outputBufferPtr();
            this.setCutoff = exports.setCutoff;
            this.setResonance = exports.setResonance;

            this.inputBuffer = new Float32Array(
              exports.memory.buffer,
              this.inputStart,
              128
            );
            this.outputBuffer = new Float32Array(
              exports.memory.buffer,
              this.outputStart,
              128
            );

            exports.init();
            this.setCutoff(250);

            this.filter = exports.filter;
          });
          break;
        case "cutoff":
          this.setCutoff(value);
          break;
        case "resonance":
          this.setResonance(value);
          break;
      }
    };
  }

  process(inputList, outputList, parameters) {
    if (!this.inputBuffer || !inputList[0][0]) {
      return true;
    }
    this.inputBuffer.set(inputList[0][0]);
    this.filter(parameters["cutoff"][0]);

    outputList[0][0].set(this.outputBuffer);
    outputList[0][1].set(this.outputBuffer);
    return true;
  }
}

registerProcessor("wasm-worklet-processor", WorkletProcessor);
