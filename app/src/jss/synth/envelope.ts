import { makeStyles } from "@material-ui/core";

export const envelopeStyles = makeStyles(() => ({
  plate: {
    margin: 4,
    display: "flex",
    flexFlow: "column",
    position: "relative",
    borderRadius: "1rem",
    marginRight: 7,
    border: "5px solid rgb(133, 225, 171)",
    backgroundColor: "rgb(55, 62, 70)",
  },
  buttonContainer: {
    display: "flex",
    flexFlow: "column",
  },
  button: {
    padding: 5,
    display: "inline-flex",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "rgb(133, 225, 171)",
    marginTop: 8,
    textAlign: "left",
    marginLeft: "0.5rem",
    marginBottom: 0,
  },
  knobText: {
    color: "rgb(55, 62, 70)",
    marginTop: 0,
    marginBottom: 0,
    fontSize: 16,
    fontVariant: "all-petite-caps",
  },
  adsrPlate: {
    backgroundColor: "rgb(133, 225, 171)",
    marginLeft: "0.5rem",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    marginTop: "0.5rem",
  },
  knobTextBright: {
    color: "rgb(133, 225, 171)",
    marginTop: 0,
    fontSize: 16,
    fontVariant: "all-petite-caps",
    marginBottom: 0,
  },
  depthPlate: {
    marginTop: "0.5rem",
  },
}));
