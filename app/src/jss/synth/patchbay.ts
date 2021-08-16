import { makeStyles } from "@material-ui/core";

export const patchbayStyles = makeStyles(() => ({
  patchbay: {
    backgroundColor: "rgb(55, 62, 70)",
    borderRadius: "1rem",
    border: "5px solid rgb(133, 225, 171)",
    position: "relative",
    zIndex: 1,
    height: 240,
    margin: 6,
  },
  jacks: {
    position: "absolute",
    top: 0,
    width: 150,
    display: "flex",
    flexWrap: "wrap",
  },
  jack: {
    width: 50,
    height: 50,
    cursor: "pointer",
  },
  separator: {
    height: 80,
    width: "100%",
  },
  label: {
    color: "rgb(133, 225, 171)",
    fontSize: "11pt",
    zIndex: -1,
    position: "relative",
    fontVariant: "all-petite-caps",
  },
}));
