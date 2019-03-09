import React from "react";

// refactor this mess

class Keyboard extends React.Component {
  state = {
    noteJSX: [],
    pressedKeys: {}
  };

  notes = [
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
    "C3"
  ];

  noteKeyboardMap = {
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
    C3: "k"
  };

  keyCodeNoteMap = {
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
    75: "C3"
  };

  createNotes = () => {
    const noteJSX = this.notes.map(value => {
      if (value.indexOf("#") !== -1) {
        return (
          <div
            id={value}
            onMouseOver={event => {
              console.log(event.target);
              this.props.sendCV(value);
            }}
            onTouchMove={event => {
              console.log(event.target);
              this.props.sendCV(value);
            }}
            className="blackNote"
          >
            {this.noteKeyboardMap[value]}
          </div>
        );
      }
      return (
        <div
          id={value}
          onMouseOver={event => {
            console.log(event.target);
            this.props.sendCV(value);
          }}
          onTouchMove={event => {
            console.log(event.target);
            this.props.sendCV(value);
          }}
          className="whiteNote"
        >
          {this.noteKeyboardMap[value]}
        </div>
      );
    });
    return noteJSX;
  };

  componentDidMount() {
    const noteJSX = this.createNotes();
    this.setState({ noteJSX });

    document.onkeydown = e => {
      e = e || window.event;
      var charCode = e.keyCode;
      const pressedKey = this.keyCodeNoteMap[charCode];
      if (pressedKey && this.state.pressedKeys[pressedKey] === undefined) {
        // control oscillator
        this.props.sendGate(true);
        this.props.sendCV(this.keyCodeNoteMap[charCode]);

        this.setState(prevState => {
          let pressedKeys = prevState.pressedKeys;
          pressedKeys[pressedKey] = true;
          return { pressedKeys };
        });

        document.getElementById(pressedKey).classList.toggle("pressed");
      }
    };

    document.onkeyup = e => {
      e = e || window.event;
      var charCode = e.keyCode;
      const pressedKey = this.keyCodeNoteMap[charCode];
      if (pressedKey) {
        this.setState(prevState => {
          let pressedKeys = prevState.pressedKeys;
          delete pressedKeys[pressedKey];
          return { pressedKeys };
        });
        document.getElementById(pressedKey).classList.toggle("pressed");
        // check wether any keys are still pressed to find out wether we should stop sendig gate signal
        // due to the asynchronous nature of setState and the potential grouping of setState calls
        // I can not reliably use a counter for number of pressed Keys
        // therefore I have to count the amount of own object keys in pressedKeys
        for (var key in this.state.pressedKeys) {
          if (this.state.pressedKeys.hasOwnProperty(key)) {
            return;
          }
        }
        this.props.sendGate(false);
      }
    };
  }

  render() {
    const { noteJSX } = this.state;
    return (
      <div
        id="keyboard"
        onMouseDown={event => {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.props.sendGate(true);
        }}
        onMouseUp={() => {
          this.props.sendGate(false);
        }}
        onTouchStart={event => {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.props.sendGate(true);
        }}
      >
        {noteJSX.map(note => note)}
      </div>
    );
  }
}

export default Keyboard;
