/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState, useCallback } from "react";
import { Input, Output } from "../../classes/synth/erebus";
import { patchbayStyles } from "../../jss/synth";
import { ModSource } from "../../types/modSource.d";
import { getRandomColor } from "../../utils";
import Knob from "../synth/knob";

const useStyles = patchbayStyles;

type Line = {
  srcIndex: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  output: Output;
  connects?: { out: number; in: number };
};

const drawPolygon = (ctx: CanvasRenderingContext2D) => (vertices = 6) => (
  origin: { x: number; y: number },
  color = "grey",
  width = 100,
) => {
  if (vertices < 3) {
    return;
  }

  const SIZE = width / vertices;
  const ANGLE = 360 / vertices;
  let start = { x: origin.x + SIZE, y: origin.y };

  const initialColor = ctx.fillStyle;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(start.x, start.y);

  for (let i = 1; i < vertices + 1; i += 1) {
    const { x, y } = start;
    const tau = Math.PI * 2; // tau > pi, literally
    const x2 = x + Math.cos((tau * ANGLE * i) / 360) * SIZE;
    const y2 = y + Math.sin((tau * ANGLE * i) / 360) * SIZE;

    ctx.lineTo(x2, y2);
    // ctx.stroke();

    start = { x: x2, y: y2 };
  }

  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = initialColor;
};

const drawSink = (ctx: CanvasRenderingContext2D) => (origin: { x: number; y: number }) => {
  const drawShape = drawPolygon(ctx);

  const drawHexagon = drawShape(6);
  const drawCircle = drawShape(30); // render a circle like its the 90s

  drawHexagon(origin, "grey");
  drawCircle({ x: origin.x + 7, y: origin.y + 3 }, "darkgrey", 74);
  drawCircle({ x: origin.x + 7, y: origin.y + 5 }, "black", 60);
};

interface PatchbayProps {
  inputs: Input[];
  outputs: Output[];
}

export default function PatchBay({ inputs, outputs }: PatchbayProps): JSX.Element {
  const classes = useStyles();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [storedLines, setStoredLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const drawCurve = useCallback(
    (line: Line) => {
      /**
       * draws a simple parable between two patch holes to simulate a cable connection
       */
      if (!ctx) {
        return;
      }

      const { x1, y1, x2, y2, color } = line;

      const initialLineWidth = ctx.lineWidth;
      const initialStrokeStyle = ctx.strokeStyle;
      ctx.lineWidth = 10;
      ctx.strokeStyle = color || "orange";

      ctx.beginPath();
      ctx.moveTo(x1, y1);

      const bezier1 = x1 + (x2 - x1) / 2; // makes cable "sag"
      const bezier2 = y1 + 200; // makes cable "sag"
      ctx.quadraticCurveTo(bezier1, bezier2, x2, y2);
      ctx.stroke();
      ctx.closePath();

      ctx.lineWidth = initialLineWidth;
      ctx.strokeStyle = initialStrokeStyle;
    },
    [ctx],
  );

  const drawJacks = useCallback(() => {
    /**
     * draws inputs/outputs as eurorack modular patch holes in a 3 column grid
     */
    if (!ctx) {
      return;
    }

    let initialPos = { x: 17, y: 20 };
    outputs.forEach((_output: Output, i: number) => {
      drawSink(ctx)({
        x: initialPos.x + (i % 3) * 50,
        y: initialPos.y + Math.floor(i / 3) * 50,
      });
    });

    initialPos = { x: 17, y: 150 };
    inputs.forEach((_input: Input, i: number) => {
      drawSink(ctx)({
        x: initialPos.x + (i % 3) * 50,
        y: initialPos.y + Math.floor(i / 3) * 50,
      });
    });
  }, [ctx, inputs, outputs]);

  // @TODO: add erebus.output as an argument, then setCurrentOutput(erebus.output)
  const onJackDown = (index: number, output: Output) => () => {
    /**
     * Event handler for when an output is selected
     * disconnects output, starts drawing a new line and sets up new connection
     */
    if (!ctx || !canvas) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJacks();

    const x = 25 + (index % 3) * 50;
    const y = 30 + Math.floor(index / 3) * 50;

    // disconnect functionally
    output.output.disconnect();

    // disconnect visually
    setStoredLines(storedLines.filter((line: Line) => !(line.srcIndex === index)));
    storedLines.forEach((line: Line) => drawCurve(line));

    setCurrentLine({
      srcIndex: index,
      x1: x,
      y1: y,
      x2: 0,
      y2: 0,
      output,
      color: getRandomColor(),
    });
  };

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!currentLine || !ctx || !canvas) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJacks();
    storedLines.forEach((line: Line) => drawCurve(line));

    const currentTargetRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - currentTargetRect.left;
    const y = e.clientY - currentTargetRect.top;
    drawCurve({ ...currentLine, x2: x, y2: y });
  };

  // @TODO: setErebus(erebus.outputs.output.connectedWith = index)
  const onJackUp = (index: number, connectInput: (output: ModSource) => void) => () => {
    if (!ctx || !canvas || !currentLine) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawJacks();

    connectInput(currentLine.output.output);
    // update state in window
    window.erebus.outputs = window.erebus.outputs.map((output) => {
      if (output.label === currentLine.output.label) {
        output.connectedWith = index;
      }
      return output;
    });

    const x = 25 + (index % 3) * 50;
    const y = 160 + Math.floor(index / 3) * 50;
    setStoredLines([
      ...storedLines,
      { ...currentLine, x2: x, y2: y, color: JSON.parse(JSON.stringify(currentLine.color)) },
    ]);
    storedLines.forEach((line: Line) => drawCurve(line));
    setCurrentLine(null);
  };

  useEffect(() => {
    if (!ctx || !canvas) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJacks();
    storedLines.forEach((line: Line) => drawCurve(line));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedLines]);

  useEffect(() => {
    if (!ctx || !canvas) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJacks();

    // draw connections
    const connections: Line[] = [];
    outputs.forEach((output: Output, index: number) => {
      if (output.connectedWith !== undefined) {
        const x1 = 25 + (index % 3) * 50;
        const y1 = 30 + Math.floor(index / 3) * 50;
        const x2 = 25 + (output.connectedWith % 3) * 50;
        const y2 = 160 + Math.floor(output.connectedWith / 3) * 50;
        connections.push({
          srcIndex: index,
          x1,
          y1,
          x2,
          y2,
          output,
          color: getRandomColor(),
        });

        // connect functionally
        inputs[output.connectedWith].connectInput(output.output);
      }
    });
    setStoredLines(connections);
  }, [ctx, drawJacks, outputs, inputs, canvas]);

  useEffect(() => {
    const c = document.getElementById("patchbay") as HTMLCanvasElement;
    if (!c) {
      return;
    }

    const context = c.getContext("2d");
    if (context === null) {
      return;
    }

    setCanvas(c);
    setCtx(context);
  }, []);

  const disconnectInput = (index: number) => () => {
    // disconnect visually
    setStoredLines(storedLines.filter((line: Line) => line.output.connectedWith !== index));

    window.erebus.outputs = window.erebus.outputs.map((output: Output) => {
      if (output.connectedWith === index) {
        output.output.disconnect();
        output.connectedWith = undefined;
      }
      return output;
    });
  };

  return (
    <div className={classes.patchbay}>
      <div className={classes.knobContainer}>
        {outputs.map(({ output, label }: Output) => (
          <div className={classes.miniknob}>
            <Knob
              min={0}
              max={1}
              initial={0.8}
              onChange={(value: number) => {
                output.max = value;
              }}
              isLinear
              name={`outputs-${label}-scaling`}
            />
          </div>
        ))}
      </div>

      <canvas id="patchbay" width="150" height="250" />
      <div className={classes.jacks} onMouseMove={onMove}>
        {outputs.map((output: Output, index: number) => (
          <div
            role="button"
            tabIndex={index + 1}
            className={classes.jack}
            onMouseDown={onJackDown(index, output)}
            onKeyPress={(e: React.KeyboardEvent<HTMLElement>) => {
              console.log(e.key);
              if (e.key === "Enter") {
                onJackDown(index, output)();
              }
            }}
          >
            <span className={classes.label}>{output.label}</span>
          </div>
        ))}
        <div className={classes.separator} />
        {inputs.map(({ label, connectInput }: Input, index: number) => (
          <div
            role="button"
            tabIndex={outputs.length + index}
            className={classes.jack}
            onMouseDown={disconnectInput(index)}
            onMouseUp={onJackUp(index, connectInput)}
            onKeyPress={(e: React.KeyboardEvent<HTMLElement>) => {
              if (e.key === "Enter") {
                onJackUp(index, connectInput)();
              }
            }}
          >
            <span className={classes.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
