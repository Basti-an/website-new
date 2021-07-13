import { makeStyles } from "@material-ui/core";

export const knobStyles = makeStyles(() => ({
  knobBig: {
    cursor: "pointer",
    height: 85,
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
  knobSmall: {
    cursor: "pointer",
    height: 52,
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
}));
