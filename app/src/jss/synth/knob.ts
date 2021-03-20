import { Theme, makeStyles } from "@material-ui/core";

export const knobStyles = makeStyles((theme: Theme) => ({
  knobBig: {
    height: "85px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
  knobSmall: {
    height: "50px",
    transform: "rotate(0deg)",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
  },
}));
