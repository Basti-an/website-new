import { makeStyles } from "@material-ui/core";

export const delayStyles = makeStyles(() => ({
  plate: {
    margin: 4,
    display: "inline-block",
    height: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    border: "5px solid rgb(133, 225, 171)",
    backgroundColor: "rgb(133, 225, 171)",
  },
  text: {
    width: "33%",
    textAlign: "center",
    color: "rgb(55, 62, 70)",
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)",
  },
  rateKnob: {
    display: "inline-flex",
    marginTop: 10,
  },
  ledOff: {
    backgroundColor: "#400000",
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: "50%",
    zIndex: -1,
    border: "1px solid #000",
  },
  ledOn: {
    backgroundColor: "#F9423A",
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: "50%",
    zIndex: 0,
    opacity: 0,
    border: "1px solid #500000",
    animation: "flickerAnimation 0.2s infinite",
    boxShadow: "0 4px 8px 0 rgba(254, 27, 7, 0.3), 0 2px 4px 0 rgba(254, 27, 7, 0.3)",
  },
  button: {
    padding: 10,
  },
  textContainer: {
    display: "flex",
  },
  ledContainer: {
    width: 20,
  },
}));
