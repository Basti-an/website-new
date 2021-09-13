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

// assumes quertz mapping, @TODO: i18n
const noteToKeyboardMap = {
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

const keyToNoteMap: { [index: string]: Note } = {};
Object.entries(noteToKeyboardMap).forEach(([key, value]) => {
  keyToNoteMap[value] = key as Note;
});

function Notes({ sendCV }: { sendCV: (cv: Note) => void }): JSX.Element {
  const noteJSX = notes.map((value) => {
    const setCV = () => {
      sendCV(value);
    };

    const onMouseOver = setCV;
    const onTouchMove = setCV;
    const onTouchStart = setCV;
    const onClick = setCV;

    if (value.indexOf("#") !== -1) {
      return (
        <div
          id={value}
          {...{ onMouseOver, onTouchMove, onTouchStart, onClick }}
          className="blackNote"
        >
          {noteToKeyboardMap[value]}
        </div>
      );
    }
    return (
      <div
        id={value}
        {...{ onMouseOver, onTouchMove, onTouchStart, onClick }}
        className="whiteNote"
      >
        {noteToKeyboardMap[value]}
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

function onKeyDown(sendCVs: (cv1: Note, cv2: Note) => void, sendGate: (gate: boolean) => void) {
  return (e: KeyboardEvent) => {
    if (e.repeat) {
      return;
    }

    e = e || window.event;
    const { key } = e;
    const pressedKey = keyToNoteMap[key];

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

function onKeyUp(sendCVs: (cv1: Note, cv2: Note) => void, sendGate: (gate: boolean) => void) {
  return (e: KeyboardEvent) => {
    e = e || window.event;
    const { key } = e;
    const releasedKey = keyToNoteMap[key];

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
        event.preventDefault();
        sendGate(true);
      }}
      onMouseUp={(event) => {
        event.preventDefault();
        sendGate(false);
      }}
      onTouchEnd={(event) => {
        event.preventDefault();
        sendGate(false);
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
