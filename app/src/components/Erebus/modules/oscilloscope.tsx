import React, { useEffect } from "react";

import { synthStyles } from "../../../jss/synth";
import Erebus from "../../../classes/synth/erebus";

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

      requestAnimationFrame(draw);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.fillStyle = "rgb(35, 42, 50)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(153, 245, 191)";
      canvasCtx.beginPath();

      const buffer = erebus.analyser.getValue() as Float32Array;
      const bufferLength = buffer.length;

      // phase-align the oscilloscope with the wave we are drawing
      // by finding the lowest sample in the area around the middle of the buffer
      // ([bufferLength/4 : bufferLength/4 * 3])
      // we then draw bufferLength/2 samples around the lowest sample we found

      // we find the lowest sample by starting in the middle of the buffer
      // walking in both sides until
      // we've reached 3/4 of the buffer length
      const midIdx = bufferLength / 2;
      let lowest = [midIdx, buffer[midIdx]];
      for (let i = 0; i < bufferLength / 4; i += 1) {
        // right
        if (buffer[midIdx + i] < lowest[1]) {
          lowest = [midIdx + i, buffer[midIdx + i]];
        }
        // left
        if (buffer[midIdx - i] < lowest[1]) {
          lowest = [midIdx - i, buffer[midIdx - i]];
        }
      }
      const lowestSampleIndex = lowest[0];
      const sliceWidth = (WIDTH * 1.0) / (bufferLength / 2);

      // draw around the lowest sample
      let x = 0;
      for (
        let i = lowestSampleIndex - bufferLength / 4;
        i < lowestSampleIndex + bufferLength / 4;
        i += 1
      ) {
        const v = buffer[i] * 1.8 * -1;
        const y = v * HEIGHT + HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }
    draw();
  }, [erebus]);

  return <canvas className={classes.osc} id="oscilloscope" width={WIDTH} height={HEIGHT} />;
}
