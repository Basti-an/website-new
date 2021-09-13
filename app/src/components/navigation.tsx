import React, { useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import Config from "../config";
import { getIsMobileOS } from "../utils";

const { hostUrl } = Config;

// this component is a PoC stuffed into a react component while not using react idioms like element references
// a refactor would be in order
// it`s a crude emulation of Mac OS X magnifying dock behaviour

export default function Navigation(): JSX.Element {
  useEffect(() => {
    const stage = document.getElementById("stage");
    const innerStage = document.getElementById("innerStage");
    const genies: NodeListOf<HTMLElement> = document.querySelectorAll(".genie");

    if (!stage || !innerStage || !genies) {
      return;
    }

    // bounding box for mouse events
    const fallOffX = 220;
    const fallOffY = 42;

    const maxMagnification = 0.6;

    const defaultWidth = 68;
    const defaultHeight = 68;

    function getDistance(rect: HTMLElement, mouseX: number, mouseY: number): [number, number] {
      const boundingRect: DOMRect = rect.getBoundingClientRect();
      let { x, y } = boundingRect;
      const { width, height } = boundingRect;

      // start from middle of rect as opposed to top left
      x += width / 2;
      y += height / 2;

      return [Math.abs(x - mouseX), Math.abs(y - mouseY)];
    }

    function resizeBar(width: number) {
      if (innerStage) {
        innerStage.style.width = `${width + 8}px`;
      }
    }

    function resizeGenie(genie: HTMLElement, distance: [number, number]) {
      const [x, y] = distance;
      const scaleX = 1 + ((fallOffX - x) / fallOffX) * maxMagnification;
      if (y > fallOffY) {
        genie.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
        if (innerStage) {
          innerStage.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
        }
        genie.style.width = `${defaultWidth}px`;
        genie.style.height = `${defaultHeight}px`;
        return defaultWidth;
      }
      if (y < fallOffY - 5) {
        genie.style.transition = "none";
        if (innerStage) {
          innerStage.style.transition = "none";
        }
      }
      const newWidth = defaultWidth * scaleX;
      const newHeight = defaultHeight * scaleX;
      genie.style.width = `${newWidth}px`;
      genie.style.height = `${newHeight}px`;

      return newWidth;
    }

    function resizeGenies(x: number, y: number) {
      let genieWidths = 0;

      genies.forEach((genie) => {
        const distance = getDistance(genie, x, y);
        const [distanceX] = distance;

        if (distanceX > fallOffX) {
          genie.style.width = `${defaultWidth}px`;
          genie.style.height = `${defaultHeight}px`;
          genie.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
          if (innerStage) {
            innerStage.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
          }
          genieWidths += defaultWidth;
          return;
        }
        const width = resizeGenie(genie, distance);
        genieWidths += width;
      });

      // add paddings to genie width
      genieWidths += genies.length * 16;

      resizeBar(genieWidths);
    }

    if (!getIsMobileOS()) {
      stage.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        resizeGenies(x, y);
      });
    } else {
      stage.addEventListener("touchmove", (e) => {
        if (!e.touches[0]) {
          return;
        }
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        resizeGenies(x, y);
      });
      stage.addEventListener("touchend", () => {
        resizeGenies(0, 0);
      });
    }

    // only let stage go as far as our effect is intended to reach,
    // so we dont handle unnecessary mouse events
    stage.style.paddingTop = `${fallOffY}px`;
  }, []);

  return (
    <div id="stage">
      <div id="innerStage" />
      <Tooltip title="Home">
        <div className="genie">
          <Link to="/">
            <img className="app-icon" alt="Home icon" src={`${hostUrl}/images/home.png`} />
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="Synthesizer">
        <div className="genie">
          <Link to="/synth">
            <img className="app-icon" alt="Home icon" src={`${hostUrl}/images/erebus_knob.png`} />
          </Link>
        </div>
      </Tooltip>
      {/* <Tooltip title="CV / Work history">
        <div className="genie">
          <Link to="/cv">
            <img
              className="app-icon"
              alt="icon of a popular app for creating documents"
              src={`${hostUrl}/images/pages.png`}
            />
          </Link>
        </div>
      </Tooltip> */}
      <Tooltip title="Contact me via email">
        <div className="genie">
          <a href="mailto:sebastian@wiendlocha.org">
            <img
              className="app-icon"
              alt="contact book icon"
              src={`${hostUrl}/images/contact.png`}
            />
          </a>
        </div>
      </Tooltip>
    </div>
  );
}
