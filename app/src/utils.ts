import { detect } from "detect-browser";

const browser = detect();

function getIsMobileOS(): boolean {
  if (!browser) {
    return false;
  }

  const { os } = browser;
  if (!os) {
    return false;
  }

  const mobileOSes = ["iOS", "Android OS", "BlackBerry OS", "Windows Mobile"];
  if (mobileOSes.includes(os)) {
    return true;
  }

  return false;
}

function getIsGoodBrowser(): boolean {
  if (!browser) {
    return false;
  }

  const { name } = browser;

  const goodBrowsers = ["chrome", "safari", "samsung"];

  if (goodBrowsers.includes(name) || getIsMobileOS()) {
    return true;
  }

  return false;
}

function checkForDevicePerformance(setFancyAnimations: React.Dispatch<boolean>): void {
  // count fps and stop background animation if fps dips below 24, based on:
  // https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html (Daniel Imms)
  let lastCalledTime: number;
  let fps: number;
  let done = false;

  // calculates fps based on time elapsed since last frame
  function refreshLoop() {
    window.requestAnimationFrame(() => {
      if (!lastCalledTime) {
        lastCalledTime = performance.now();
        fps = 0;
        refreshLoop();
        return;
      }

      const delta = (performance.now() - lastCalledTime) / 1000;
      lastCalledTime = performance.now();
      fps = 1 / delta;

      if (!done) {
        refreshLoop();
      }
    });
  }

  // start fps counter
  refreshLoop();

  // sample FPS after component had time to ramp up rendering
  const cookFor = 3000;
  setTimeout(() => {
    done = true;
    console.log(`FPS after ${Math.floor(cookFor / 1000)} seconds:`, Math.floor(fps));

    // disable "flowing" background
    if (getIsMobileOS()) {
      // mobile animation uses different turbulence values and still looks nice™ at lower fps
      if (fps < 10) {
        setFancyAnimations(false);
        window.prohibitFlowing = true;
      }
    } else if (fps < 18) {
      setFancyAnimations(false);
    }
  }, cookFor);
}

function getLinValue(sliderValue: number, min: number, max: number): number {
  const maxp = 280;
  const linVal = sliderValue / maxp;
  const range = max - min;
  const inRangeVal = linVal * range;

  return min + inRangeVal;
}

function getLogRemapped(
  value: number,
  min: number,
  max: number,
  minp: number,
  maxp: number,
): number {
  if (min === 0) {
    min += 1;
    max += 1;
  }

  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (value - minp));
}

function getLogValue(sliderValue: number, min: number, max: number): number {
  return getLogRemapped(sliderValue, min, max, 0, 280);
}

function getSliderValueForLogValue(value: number, min: number, max: number): number {
  // log doesnt work for 0
  if (min === 0 || value === 0) {
    min += 1;
    max += 1;
    value += 1;
  }

  const minLog = Math.log(min);
  const maxLog = Math.log(max) - minLog;
  const valueLog = Math.log(value) - minLog;
  return (valueLog / maxLog) * 280 - 140;
}

function getSliderValueForLinValue(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return (value / max) * 280 - 140;
}

function getIsMobileDevice(): boolean {
  // detect mobile device
  return (
    typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

function getRandomColor(): string {
  const cableColors = [
    "orange",
    "red",
    "darkblue",
    "teal",
    "aqua",
    "navy",
    "fuchsia",
    "lime",
    "olive",
    "maroon",
    "purple",
  ];
  return cableColors[Math.floor(Math.random() * cableColors.length)];
}

const allSequencerNotes = [
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
];

// @TODO finalize MIDI handling
// if (typeof navigator.requestMIDIAccess === "function") {
//   console.log("This browser supports WebMIDI!");
// } else {
//   console.log("WebMIDI is not supported in this browser.");
//   return;
// }
// type Note =
//   | "C2"
//   | "C#2"
//   | "D2"
//   | "D#2"
//   | "E2"
//   | "F2"
//   | "F#2"
//   | "G2"
//   | "G#2"
//   | "A2"
//   | "A#2"
//   | "B2"
//   | "C3";
// const midiNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
//   const command = message.data[0];
//   const note = message.data[1];
//   const velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

//   switch (command) {
//     case 144: // note on
//       if (velocity > 0) {
//         // todo
//         const pressedKey = midiNotes[note - 24] as Note;
//         window.pressedKeys.push(pressedKey);
//         // sendCVs(window.pressedKeys[0], pressedKey);
//         // sendGate(true);
//         console.log(note);
//         const pressedKeyEl = document.getElementById(pressedKey);
//         if (!pressedKeyEl) {
//           console.error("could not find pressedKey in DOM: ", pressedKey);
//           return;
//         }
//         pressedKeyEl.classList.add("pressed");
//       } else {
//         console.log(note);
//       }
//       break;
//     case 128: // note off
//       {
//         console.log(note);
//         const releasedKey = midiNotes[note] as Note;

//         // remove releasedKey from pressedKeys
//         const releasedKeyIndex = window.pressedKeys.indexOf(releasedKey);
//         if (releasedKeyIndex === -1) {
//           return;
//         }
//         // sendCVs(window.pressedKeys[0], window.pressedKeys[window.pressedKeys.length - 1]);

//         const releasedKeyEl = document.getElementById(releasedKey);
//         if (!releasedKeyEl) {
//           console.error("could not find releasedKey in DOM: ", releasedKey);
//           return;
//         }

//         // remove key from window.pressedKeys
//         window.pressedKeys.splice(releasedKeyIndex, 1);
//         if (window.pressedKeys.length === 0) {
//           // sendGate(false);

//           releasedKeyEl.classList.remove("pressed");
//         }
//       }
//       break;
//     default:
//       break;
//   }
// }

// function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
//   midiAccess.inputs.forEach((input) => {
//     input.onmidimessage = getMIDIMessage;
//   });
// }

// function onMIDIFailure() {
//   console.log("Could not access your MIDI devices.");
// }

// navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

export {
  getIsMobileOS,
  getIsGoodBrowser,
  checkForDevicePerformance,
  getLinValue,
  getLogValue,
  getLogRemapped,
  allSequencerNotes,
  getSliderValueForLinValue,
  getSliderValueForLogValue,
  getIsMobileDevice,
  getRandomColor,
};
