import React from "react";
import ReactDOM from "react-dom";
import Container from "./Container.js";
import "./index.css";

const githubRepoLink = "https://github.com/Basti-an/website-new";

console.log("Hello, my tech-savy friend!");
console.log(
  `if you are interested, the source code for this site can be found at: ${githubRepoLink}`,
);

ReactDOM.render(<Container />, document.getElementById("root"));
// registerServiceWorker();
