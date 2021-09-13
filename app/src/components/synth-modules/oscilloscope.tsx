import React, { useEffect } from "react";

import { synthStyles } from "../../jss/synth";
import Erebus from "../../classes/synth/erebus";

const useStyles = synthStyles;

interface OscilloscopeProps {
  erebus: Erebus;
}

const WIDTH = 205;
const HEIGHT = 115;

export default function Oscilloscope({ erebus }: OscilloscopeProps): JSX.Element {
  const classes = useStyles();

  useEffect(() => {
    const c = document.getElementById("oscilloscope") as HTMLCanvasElement;
    if (!c) {
      return;
    }

    const canvasCtx = c.getContext("2d");
    if (canvasCtx === null) {
      return;
    }

    function draw() {
      if (!canvasCtx || !erebus) {
        return;
      }

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      requestAnimationFrame(draw);

      // only change this value in tandem with erebus.analyser.fftsize
      const bufferLength = 2048;

      canvasCtx.fillStyle = "rgb(35, 42, 50)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(153, 245, 191)";
      canvasCtx.beginPath();

      const buffer = erebus.analyser.getValue() as Float32Array;
      const amplitude = window.erebus.vca.output.gain.value;

      // setup vars for ramp detection in order to quasi phase-align the oscilloscope
      const treshold = 0.64 * amplitude;
      let lastSample: undefined | number;
      let start = false;

      let x = 0;
      buffer.forEach((sample: number, index: number) => {
        // detect ramps
        if (!start) {
          if (sample < -1 * treshold) {
            lastSample = sample;
          } else if (sample > treshold && lastSample !== undefined) {
            start = true;
          }
          return;
        }

        const sliceWidth = (WIDTH * 1.0) / bufferLength;

        const v = sample + 1;
        const y = (v * HEIGHT) / 2;

        if (index === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      });

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }
    draw();
  }, [erebus]);

  return <canvas className={classes.osc} id="oscilloscope" width={WIDTH} height={HEIGHT} />;
}
