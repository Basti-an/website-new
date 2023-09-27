import { detect } from "detect-browser";

const browser = detect();

export type Primitive = number | boolean | string | undefined;

function getIsMobileOS(): boolean {
  const mobileOSes = ["iOS", "Android OS", "BlackBerry OS", "Windows Mobile"];
  return mobileOSes.includes(browser?.os || "");
}

function getIsGoodBrowser() {
  return ["chrome", "safari", "samsung"].includes(browser?.name || "");
}

function getLinValue(sliderValue: number, min: number, max: number): number {
  const range = max - min;
  const linVal = (sliderValue / 280) * range + min;
  return linVal;
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

function clamp(x: number, minmax: number) {
  return x > minmax ? minmax : x < -minmax ? -minmax : x;
}

function getSliderValueForLinValue(value: number, min: number, max: number): number {
  return clamp(((value - min) / (max - min)) * 280 - 140, 140);
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

function storeErebusPatchValue(patchName: string, componentName: string, value: Primitive): void {
  if (patchName === "initial-patch") {
    return;
  }

  const patchJSON = localStorage.getItem(`erebus-patches-${patchName}`);
  if (!patchJSON) {
    console.error(`patch ${patchName} not found in localStorage while attempting save`);
    return;
  }

  const patch = JSON.parse(patchJSON);

  patch[componentName] = value;
  localStorage.setItem(`erebus-patches-${patchName}`, JSON.stringify(patch));
}

function loadErebusPatchValue(patchName: string, componentName: string): Primitive | null {
  if (patchName === "initial-patch") {
    return null;
  }

  const patchJSON = localStorage.getItem(`erebus-patches-${patchName}`);
  if (!patchJSON) {
    console.error(`patch ${patchName} not found in localStorage while attempting load`);
    return null;
  }

  const patch = JSON.parse(patchJSON);

  if (patch[componentName] === undefined) {
    return null;
  }

  return patch[componentName];
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

function storeErebusValue(componenName: string, value: Primitive): void {
  localStorage.setItem(componenName, JSON.stringify(value));
}

function loadErebusValue(componenName: string): Primitive | null {
  const localValue = localStorage.getItem(componenName);
  if (localValue === null) {
    return null;
  }

  return JSON.parse(localValue);
}

const isSafari = navigator.userAgent.indexOf("Safari") > -1;
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

function sortDescending(a: string, b: string) {
  return parseInt(b, 10) - parseInt(a, 10);
}

export {
  getIsMobileOS,
  getIsGoodBrowser,
  getLinValue,
  getLogValue,
  getLogRemapped,
  allSequencerNotes,
  getSliderValueForLinValue,
  getSliderValueForLogValue,
  getIsMobileDevice,
  getRandomColor,
  storeErebusPatchValue,
  loadErebusPatchValue,
  storeErebusValue,
  loadErebusValue,
  isSafari,
  isFirefox,
  sortDescending,
  clamp,
};
