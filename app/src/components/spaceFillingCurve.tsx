import React, { useEffect, useRef } from "react";
import gilbert from "../lib/gilbert";

function getElementWidth(element: HTMLElement | Element) {
  return Math.max(element.clientWidth || 0, window.innerWidth || 0);
}
function getElementHeight(element: HTMLElement | Element) {
  return Math.max(element.clientWidth || 0, window.innerWidth || 0);
}

interface ISpaceFillingCurve {
  type: "Hilbert";
  scale?: number;
  renderTo?: HTMLElement | string | Element;
  paddingX?: number;
  paddingY?: number;
}

function getSpaceFillingCurveGenerator(type: string, width: number, height: number) {
  if (type === "Hilbert") {
    return gilbert(width, height);
  }
  return undefined;
}

function SpaceFillingCurve({
  type = "Hilbert",
  scale = 12,
  renderTo = document.documentElement,
  paddingX = 16,
  paddingY = 16,
}: ISpaceFillingCurve): JSX.Element {
  const path = useRef<SVGPathElement>(null);
  const strokeWidth = scale / 3;
  const [offsetX, offsetY] = [strokeWidth, strokeWidth];

  useEffect(() => {
    if (!path.current) {
      return;
    }

    let element;
    if (typeof renderTo === "string") {
      element = document.querySelector(renderTo);
    }
    if (!element) {
      element = document.documentElement;
    }

    const width = getElementWidth(element) - paddingX;
    const height = getElementHeight(element) - paddingY;

    // we have to "scale" down the vw/vh to compensate for stroke width
    const curveWidth = Math.floor((width - strokeWidth) / scale);
    const curveHeight = Math.floor((height - strokeWidth) / scale);

    const hilbertCurveGenerator = getSpaceFillingCurveGenerator(type, curveWidth, curveHeight);

    if (!hilbertCurveGenerator) {
      console.error(`cannot get space filling curve: ${type}`);
      return;
    }

    let done = false;
    let pathString = `M ${offsetX / 2},${offsetY}\n`;

    while (!done) {
      const next = hilbertCurveGenerator.next();
      if (!next) {
        break;
      }

      if (next.value) {
        pathString += `L${next.value[0] * scale + offsetX},${next.value[1] * scale + offsetY}`;
      }
      if (next.done) {
        done = true;
        break;
      }
    }

    path.current.setAttribute("d", pathString);

    // const length = path.current.getTotalLength();
    // path.current.style.strokeDasharray = `${length}px`;
    // path.current.style.strokeDashoffset = `${length}px`;
  }, [type, offsetX, offsetY, scale, strokeWidth, renderTo, paddingX, paddingY]);

  return (
    <svg id="SpaceFillingCurve">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#05a" />
          <stop offset="100%" stopColor="#0a5" />
        </linearGradient>
      </defs>
      <path fill="none" strokeWidth={strokeWidth} d="" ref={path} className="draw2" />
    </svg>
  );
}

export default React.memo(SpaceFillingCurve);
