import { makeStyles } from "@material-ui/core";

export const vcaStyles = makeStyles(() => ({
  plate: {
    margin: 4,
    height: 240,
    display: "inline-block",
    width: 140,
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(133, 225, 171)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  topplate: {
    zIndex: 0,
    height: 0,
    width: 0,
    borderLeft: "50px solid transparent",
    borderRight: "50px solid transparent",
    borderTop: "80px solid rgb(133, 225, 171)",
    marginRight: "auto",
    marginLeft: "auto",
  },
  bottomplate: {
    zIndex: 0,
    position: "absolute",
    bottom: 0,
    height: "10px",
    width: "calc(100% - 10px)",
    paddingBottom: 17,
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 46,
    backgroundColor: "rgb(133, 225, 171)",
    color: "rgb(55, 62, 70)",
    textAlign: "center",
  },
  attack: {
    position: "absolute",
    left: "10px",
    bottom: "40px",
    zIndex: 1000,
    height: "50px",
    display: "block",
  },
  release: {
    position: "absolute",
    bottom: "40px",
    zIndex: 1000,
    height: "50px",
    right: "10px",
    display: "block",
  },
  text: {
    marginTop: "5px",
    textAlign: "center",
    color: "rgb(133, 225, 171)",
    fontVariant: "all-Petite-caps",
  },
  textBottom: {
    width: "50%",
    textAlign: "center",
    color: "rgb(55, 62, 70)",
    fontVariant: "all-Petite-caps",
  },
  textContainer: {
    display: "flex",
  },
  headertext: {
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    position: "absolute",
    top: "10px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "calc(100%)",
  },
  knobLevel: {
    marginTop: -47,
  },
  knobAttack: {
    zIndex: 1000,
    display: "inline-block",
    padding: 10,
    position: "relative",
  },

  knobRelease: {
    zIndex: 1000,
    display: "inline-block",
    padding: 10,
    position: "relative",
  },
  knobContainer: {
    marginTop: 6,
    display: "flex",
  },
}));
