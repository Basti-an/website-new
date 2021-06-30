import { makeStyles } from "@material-ui/core";

export const lfoStyles = makeStyles(() => ({
  plate: {
    display: "inline-flex",
    height: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(143, 235, 181)",
    backgroundColor: "rgb(143, 235, 181)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  text: {
    width: "50%",
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
  shape: {
    padding: 5,
    backgroundColor: "rgb(55, 62, 70)",
    borderRadius: 12,
  },
  switchText: {
    color: "rgb(143, 235, 181)",
    fontSize: "20px",
  },
  components: {},
}));