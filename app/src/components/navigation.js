import React, { useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import Config from "../config";
const { hostUrl } = Config;

// this component is a PoC stuffed into a react component while not using react idioms, a refactor would be in order
// it`s a pretty neat emulation of Mac OS X magnifying dock behaviour

function Navigation(props) {
  useEffect(() => {
    const stage = document.getElementById("stage");
    console.log(stage);
    const innerStage = document.getElementById("innerStage");
    const genies = document.querySelectorAll(".genie");

    const fallOffX = 220;
    const fallOffY = 100;
    const maxMagnification = 0.6;
    const defaultWidth = 68;
    const defaultHeight = 68;

    stage.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      console.log(x);
      console.log(y);
      resizeGenies(x, y);
    });

    function getDistance(rect, mouseX, mouseY) {
      let { x, y, width, height } = rect.getBoundingClientRect();
      // start from middle of rect as opposed to top left
      x += width / 2;
      y += height / 2;
      return [Math.abs(x - mouseX), Math.abs(y - mouseY)];
    }

    stage.style.paddingTop = `${fallOffY}px`;

    function resizeGenies(x, y) {
      let genieWidths = 0;
      genies.forEach((genie) => {
        const distance = getDistance(genie, x, y);
        const [distanceX] = distance;

        if (distanceX > fallOffX) {
          genie.style.width = `${defaultWidth}px`;
          genie.style.height = `${defaultHeight}px`;
          genie.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
          innerStage.style.transition =
            "width 0.2s ease-out, height 0.2s ease-out";
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

    function resizeGenie(genie, distance) {
      const [x, y] = distance;
      const scaleX = 1 + ((fallOffX - x) / fallOffX) * maxMagnification;
      if (y > fallOffY) {
        genie.style.transition = "width 0.2s ease-out, height 0.2s ease-out";
        innerStage.style.transition =
          "width 0.2s ease-out, height 0.2s ease-out";
        genie.style.width = `${defaultWidth}px`;
        genie.style.height = `${defaultHeight}px`;
        return defaultWidth;
      }
      if (y < fallOffY - 5) {
        genie.style.transition = "none";
        innerStage.style.transition = "none";
      }
      const newWidth = defaultWidth * scaleX;
      const newHeight = defaultHeight * scaleX;
      genie.style.width = `${newWidth}px`;
      genie.style.height = `${newHeight}px`;

      return newWidth;
    }

    function resizeBar(width) {
      innerStage.style.width = `${width + 8}px`;
    }
  }, []);

  return (
    <div id="stage">
      <div id="innerStage"></div>
      <Tooltip title="Home">
        <div className="genie">
          <Link to="/">
            <img
              className="app-icon"
              alt="Home icon"
              src={`${hostUrl}/images/home.png`}
            ></img>
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="CV / Work history">
        <div className="genie">
          <Link to="/cv">
            <img
              className="app-icon"
              alt="icon of a popular app for creating documents"
              src={`${hostUrl}/images/pages.png`}
            ></img>
          </Link>
        </div>
      </Tooltip>
      <Tooltip title="Contact me via email">
        <div className="genie">
          <a href="mailto:sebastian@wiendlocha.org">
            <img
              className="app-icon"
              alt="contact book icon"
              src={`${hostUrl}/images/contact.png`}
            ></img>
          </a>
        </div>
      </Tooltip>
    </div>
  );
}

export default Navigation;
