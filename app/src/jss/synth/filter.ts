import { makeStyles } from "@material-ui/core";

export const filterStyles = makeStyles(() => ({
  plate: {
    margin: 4,
    display: "inline-block",
    height: "240px",
    width: "100px",
    zIndex: 100,
    position: "relative",
    borderRadius: "1rem",
    marginRight: "7px",
    border: "5px solid rgb(133, 225, 171)",
    backgroundColor: "rgb(55, 62, 70)",
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
    padding: "25px",
    paddingRight: "5px",
    paddingLeft: "5px",
    paddingTop: 46,
    paddingBottom: 17,
    backgroundColor: "rgb(133, 225, 171)",
    color: "rgb(55, 62, 70)",
    textAlign: "center",
    fontVariant: "all-petite-caps",
  },
  text: {
    marginTop: "5px",
    textAlign: "center",
    color: "rgb(133, 225, 171)",
    fontVariant: "all-petite-caps",
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
  freqKnob: {
    marginTop: "-48px",
  },
  resKnob: {
    position: "absolute",
    marginLeft: "25%",
    marginTop: "15px",
  },
}));
