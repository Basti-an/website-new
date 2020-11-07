import React, { useEffect } from "react";

const notes = [
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

const keyCodeNoteMap = {
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

function Notes({ sendCV }) {
  const noteJSX = notes.map((value) => {
    if (value.indexOf("#") !== -1) {
      return (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <div
          id={value}
          onMouseOver={(event) => {
            sendCV(value);
          }}
          onTouchMove={(event) => {
            console.log("touch move");
            sendCV(value);
          }}
          onTouchStart={(event) => {
            console.log("touch start");
            sendCV(value);
          }}
          onTouchEnd={(event) => {
            console.log("touch end");
            sendCV(value);
          }}
          onClick={(event) => {
            console.log("onClick");
            sendCV(value);
          }}
          className="blackNote"
        >
          {noteKeyboardMap[value]}
        </div>
      );
    }
    return (
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <div
        id={value}
        onMouseOver={(event) => {
          sendCV(value);
        }}
        onTouchMove={(event) => {
          console.log("touch move");
          sendCV(value);
        }}
        onTouchStart={(event) => {
          console.log("touch start");
          sendCV(value);
        }}
        onTouchEnd={(event) => {
          console.log("touch end");
          sendCV(value);
        }}
        onClick={(event) => {
          console.log("onClick");
          sendCV(value);
        }}
        className="whiteNote"
      >
        {noteKeyboardMap[value]}
      </div>
    );
  });
  return noteJSX;
}

const pressedKeys = [];

// generates an eventhandler in the scope of the react component below
function onKeyDown(sendCVs, sendGate) {
  return (e) => {
    if (e.repeat) {
      return;
    }

    e = e || window.event;
    const charCode = e.keyCode;
    const pressedKey = keyCodeNoteMap[charCode];

    if (!pressedKey) {
      return;
    }
    document.getElementById(pressedKey).classList.add("pressed");
    pressedKeys.push(pressedKey);
    sendCVs(pressedKeys[0], pressedKey);

    sendGate(true);
  };
}

// generates an eventhandler in the scope of the react component below
function onKeyUp(sendCVs, sendGate) {
  return (e) => {
    e = e || window.event;
    const charCode = e.keyCode;
    const releasedKey = keyCodeNoteMap[charCode];
    if (!releasedKey) {
      return;
    }

    document.getElementById(releasedKey).classList.remove("pressed");
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

function Keyboard(props) {
  const {
    sendCVs, sendGate,
  } = props;

  useEffect(() => {
    document.onkeydown = onKeyDown(sendCVs, sendGate);
    document.onkeyup = onKeyUp(sendCVs, sendGate);
  }, [sendCVs, sendGate]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id="keyboard"
      onMouseDown={(event) => {
        // eslint-disable-next-line no-unused-expressions
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false);
        sendGate(true);
      }}
      onMouseUp={() => {
        sendGate(false);
      }}

      onTouchStart={(event) => {
        console.log("sending gate");
        sendGate(true);
        // eslint-disable-next-line no-unused-expressions
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false);
      }}
      onTouchEnd={(event) => {
        console.log("stopping gate");
        sendGate(false);
        // eslint-disable-next-line no-unused-expressions
        event.preventDefault
          ? event.preventDefault()
          : (event.returnValue = false);
      }}
    >
      {/* TODO: add octave shift button */}
      <Notes sendCV={(value) => { sendCVs(value, value); }} />
    </div>
  );
}

export default Keyboard;
