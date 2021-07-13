/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect } from "react";

type Note =
  | "C2"
  | "C#2"
  | "D2"
  | "D#2"
  | "E2"
  | "F2"
  | "F#2"
  | "G2"
  | "G#2"
  | "A2"
  | "A#2"
  | "B2"
  | "C3";

const notes: Note[] = [
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
];

const midiNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const noteKeyboardMap = {
  C2: "a",
  "C#2": "w",
  D2: "s",
  "D#2": "e",
  E2: "d",
  F2: "f",
  "F#2": "t",
  G2: "g",
  "G#2": "z",
  A2: "h",
  "A#2": "u",
  B2: "j",
  C3: "k",
};

const keyCodeNoteMap: { [index: number]: Note } = {
  65: "C2",
  87: "C#2",
  83: "D2",
  69: "D#2",
  68: "E2",
  70: "F2",
  84: "F#2",
  71: "G2",
  90: "G#2",
  72: "A2",
  85: "A#2",
  74: "B2",
  75: "C3",
};

function Notes({ sendCV }: { sendCV: (cv: Note) => void }): JSX.Element {
  const noteJSX = notes.map((value) => {
    if (value.indexOf("#") !== -1) {
      return (
        <div
          id={value}
          onMouseOver={() => {
            sendCV(value);
          }}
          onTouchMove={() => {
            sendCV(value);
          }}
          onTouchStart={() => {
            sendCV(value);
          }}
          onTouchEnd={() => {
            sendCV(value);
          }}
          onClick={() => {
            sendCV(value);
          }}
          className="blackNote"
        >
          {noteKeyboardMap[value]}
        </div>
      );
    }
    return (
      <div
        id={value}
        onMouseOver={() => {
          sendCV(value);
        }}
        onTouchMove={() => {
          sendCV(value);
        }}
        onTouchStart={() => {
          sendCV(value);
        }}
        onTouchEnd={() => {
          sendCV(value);
        }}
        onClick={() => {
          sendCV(value);
        }}
        className="whiteNote"
      >
        {noteKeyboardMap[value]}
      </div>
    );
  });
  return <>{noteJSX}</>;
}

const pressedKeys: Note[] = [];

// generates an eventhandler in the scope of the react component below
function onKeyDown(sendCVs: (cv1: Note, cv2: Note) => void, sendGate: (gate: boolean) => void) {
  return (e: KeyboardEvent) => {
    if (e.repeat) {
      return;
    }

    e = e || window.event;
    const charCode = e.keyCode;
    const pressedKey = keyCodeNoteMap[charCode];

    if (!pressedKey) {
      return;
    }
    const pressedKeyEl = document.getElementById(pressedKey);
    if (!pressedKeyEl) {
      console.error("pressed key not found in DOM: ", pressedKey);
      return;
    }
    pressedKeyEl.classList.add("pressed");
    pressedKeys.push(pressedKey);
    sendCVs(pressedKeys[0], pressedKey);

    sendGate(true);
  };
}

// generates an eventhandler in the scope of the react component below
function onKeyUp(sendCVs: (cv1: Note, cv2: Note) => void, sendGate: (gate: boolean) => void) {
  return (e: KeyboardEvent) => {
    e = e || window.event;
    const charCode = e.keyCode;
    const releasedKey = keyCodeNoteMap[charCode];
    if (!releasedKey) {
      return;
    }
    const releasedKeyEl = document.getElementById(releasedKey);
    if (!releasedKeyEl) {
      console.error("released Key not found in DOM: ", releasedKey);
      return;
    }
    releasedKeyEl.classList.remove("pressed");

    // remove releasedKey from pressedKeys
    const releasedKeyIndex = pressedKeys.indexOf(releasedKey);
    if (releasedKeyIndex === -1) {
      return;
    }

    // remove key from pressedKeys
    pressedKeys.splice(releasedKeyIndex, 1);
    if (pressedKeys.length === 0) {
      sendGate(false);
      return;
    }
    sendCVs(pressedKeys[0], pressedKeys[pressedKeys.length - 1]);
  };
}

interface KeyboardProps {
  sendCVs: (cv1: Note, cv2: Note) => void;
  sendGate: (gate: boolean) => void;
}

export default function Keyboard({ sendCVs, sendGate }: KeyboardProps): JSX.Element {
  useEffect(() => {
    document.onkeydown = onKeyDown(sendCVs, sendGate);
    document.onkeyup = onKeyUp(sendCVs, sendGate);
  }, [sendCVs, sendGate]);

  useEffect(() => {
    if (typeof navigator.requestMIDIAccess === "function") {
      console.log("This browser supports WebMIDI!");
    } else {
      console.log("WebMIDI is not supported in this browser.");
      return;
    }

    // @TODO: externalize midi handling into own file
    function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
      const command = message.data[0];
      const note = message.data[1];
      const velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

      switch (command) {
        case 144: // note on
          if (velocity > 0) {
            // todo
            const pressedKey = midiNotes[note - 24] as Note;
            pressedKeys.push(pressedKey);
            sendCVs(pressedKeys[0], pressedKey);
            sendGate(true);
            console.log(note);
            const pressedKeyEl = document.getElementById(pressedKey);
            if (!pressedKeyEl) {
              console.error("could not find pressedKey in DOM: ", pressedKey);
              return;
            }
            pressedKeyEl.classList.add("pressed");
          } else {
            console.log(note);
          }
          break;
        case 128: // note off
          {
            console.log(note);
            const releasedKey = midiNotes[note] as Note;

            // remove releasedKey from pressedKeys
            const releasedKeyIndex = pressedKeys.indexOf(releasedKey);
            if (releasedKeyIndex === -1) {
              return;
            }
            sendCVs(pressedKeys[0], pressedKeys[pressedKeys.length - 1]);

            const releasedKeyEl = document.getElementById(releasedKey);
            if (!releasedKeyEl) {
              console.error("could not find releasedKey in DOM: ", releasedKey);
              return;
            }

            // remove key from pressedKeys
            pressedKeys.splice(releasedKeyIndex, 1);
            if (pressedKeys.length === 0) {
              sendGate(false);

              releasedKeyEl.classList.remove("pressed");
            }
          }
          break;
        default:
          break;
      }
    }

    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = getMIDIMessage;
      });
    }

    function onMIDIFailure() {
      console.log("Could not access your MIDI devices.");
    }

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id="keyboard"
      onMouseDown={(event) => {
        event.preventDefault();
        sendGate(true);
      }}
      onMouseUp={() => {
        sendGate(false);
      }}
      onTouchStart={(event) => {
        sendGate(true);
        event.preventDefault();
      }}
      onTouchEnd={(event) => {
        sendGate(false);
        event.preventDefault();
      }}
    >
      {/* TODO: add octave shift button */}
      <Notes
        sendCV={(value) => {
          sendCVs(value, value);
        }}
      />
    </div>
  );
}
