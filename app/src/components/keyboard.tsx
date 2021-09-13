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
    const setCV = () => {
      sendCV(value);
    };

    if (value.indexOf("#") !== -1) {
      return (
        <div
          id={value}
          onMouseOver={setCV}
          onTouchMove={setCV}
          onTouchStart={setCV}
          onClick={setCV}
          className="blackNote"
        >
          {noteKeyboardMap[value]}
        </div>
      );
    }
    return (
      <div
        id={value}
        onMouseOver={setCV}
        onTouchMove={setCV}
        onTouchStart={setCV}
        onClick={setCV}
        className="whiteNote"
      >
        {noteKeyboardMap[value]}
      </div>
    );
  });
  return <>{noteJSX}</>;
}

declare global {
  interface Window {
    pressedKeys: Note[];
  }
}

window.pressedKeys = [];

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
    window.pressedKeys.push(pressedKey);
    sendCVs(window.pressedKeys[0], pressedKey);

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
    const releasedKeyIndex = window.pressedKeys.indexOf(releasedKey);
    if (releasedKeyIndex === -1) {
      return;
    }

    // remove key from pressedKeys
    window.pressedKeys.splice(releasedKeyIndex, 1);
    if (window.pressedKeys.length === 0) {
      sendGate(false);
      return;
    }
    sendCVs(window.pressedKeys[0], window.pressedKeys[window.pressedKeys.length - 1]);
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

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id="keyboard"
      onMouseDown={(event) => {
        event.preventDefault();
        sendGate(true);
      }}
      onTouchStart={(event) => {
        sendGate(true);
        event.preventDefault();
      }}
      onMouseUp={(event) => {
        event.preventDefault();
        sendGate(false);
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
