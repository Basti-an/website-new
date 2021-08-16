import { makeStyles } from "@material-ui/core";
import Config from "../../config";

export const sequencerStyles = makeStyles(() => ({
  plate: {
    boxSizing: "border-box",
    background: `url("${Config.hostUrl}/images/wood-texture-unsplash.jpg")`,
    backgroundSize: "cover",
    backgroundPositionY: "bottom",
    width: "100%",
    maxWidth: 800,
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    position: "relative",
    borderRadius: "1rem",
    border: "5px solid #4D5458",
    backgroundColor: "rgb(55, 62, 70)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  row: {
    display: "flex",
    flexFlow: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noteTextBright: {
    color: "rgb(133, 225, 171)",
    margin: 5,
  },
  noteText: {
    color: "rgb(133, 225, 171)",
    margin: 5,
  },
  tempo: {
    padding: 5,
  },
  gate: {
    padding: 5,
  },
  sequencerButton: {
    "&:hover": {
      backgroundColor: "#E9322A",
    },
    padding: 5,
    border: "1px solid #000",
    borderRadius: 4,
    backgroundColor: "#F9423A",
    margin: 5,
    cursor: "pointer",
  },
  padded: {
    padding: 5,
  },
  padLeft: {
    paddingLeft: "1rem",
  },
  headerText: {
    color: "rgb(133, 225, 171)",
    fontSize: "20px",
    backgroundColor: "#4D5458",
    margin: 0,
    padding: "1rem",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sequence: {
    maxWidth: 530,
    backgroundColor: "#4D5458",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
  },
  ledOff: {
    backgroundColor: "#400000",
    width: 13,
    height: 13,
    borderRadius: "50%",
    border: "1px solid #000",
    marginBottom: 5,
  },
  ledOn: {
    backgroundColor: "#F9423A",
    width: 13,
    height: 13,
    borderRadius: "50%",
    border: "1px solid #500000",
    transition: "background-color 0.1s ease-in-out",
    boxShadow: "0 4px 8px 0 rgba(254, 27, 7, 0.3), 0 2px 4px 0 rgba(254, 27, 7, 0.3)",
    marginBottom: 5,
  },
  tempoPlate: {
    backgroundColor: "#4D5458",
    borderRadius: 16,
    margin: "1rem",
  },
}));
