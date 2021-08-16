import { makeStyles } from "@material-ui/core";

export const switchStyles = makeStyles(() => ({
  switch: {
    width: 30,
    height: 37,
  },
  switchButton: {
    cursor: "pointer",
    padding: 0,
    border: "none",
    outline: "none",
    background: "inherit",
  },
  hide: {
    display: "none",
  },
}));
