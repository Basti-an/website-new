import { makeStyles } from "@material-ui/core";

export const memoryBankStyles = makeStyles(() => ({
  plate: {
    width: "100%",
    maxWidth: 775,
    padding: "1rem",
    display: "flex",
    flexFlow: "row",
    position: "relative",
    boxSizing: "border-box",
    borderRadius: "1rem",
    border: "5px solid rgb(133, 225, 171)",
    backgroundColor: "rgb(55, 62, 70)",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  headerText: {
    color: "rgb(133, 225, 171)",
    marginTop: 8,
    textAlign: "left",
    marginLeft: "0.5rem",
    marginBottom: 0,
  },
  patchNameInput: {
    "&:focus": {
      outline: "none",
    },
    maxWidth: 200,
    borderRadius: 30,
    margin: "0 1rem",
    backgroundColor: "rgb(35, 42, 50)",
    padding: "0.5rem",
    color: "rgb(133, 225, 171)",
    border: "2px solid rgb(133, 225, 171)",
  },
  newPatchButton: {
    maxWidth: 50,
    backgroundColor: "rgb(133, 225, 171)",
    color: "rgb(35, 42, 50)",
    borderRadius: 30,
    fontSize: "17px",
    fontVariant: "all-petite-caps",
    fontWeight: 300,
  },
  flex: {
    display: "flex",
  },
  select: {
    padding: "0.5rem",
    "&:focus": {
      outline: "none",
    },
    maxWidth: 200,
    width: "100%",
    borderRadius: 5,
    margin: "0 1rem",
    backgroundColor: "rgb(35, 42, 50)",
    color: "rgb(133, 225, 171)",
    border: "2px solid rgb(133, 225, 171)",
    textShadow: `0px 0px 2px #fe1400`,
  },
}));
