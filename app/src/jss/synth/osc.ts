import { makeStyles } from "@material-ui/core";

export const oscStyles = makeStyles(() => ({
  plate: {
    width: 260,
    display: "flex",
    flexFlow: "column",
    height: 245,
    position: "relative",
    borderRadius: "1rem",
    marginRight: 7,
    border: "5px solid rgb(143, 235, 181)",
    borderBottom: "none",
    backgroundColor: "rgb(55, 62, 70)",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },
  mixPanel: {
    backgroundColor: "rgb(143, 235, 181)",
    borderBottomLeftRadius: "14px",
    borderBottomRightRadius: "14px",
    alignSelf: "center",
  },
  darkText: {
    color: "rgb(55, 62, 70)",
    marginTop: 0,
    marginBottom: 4,
    fontSize: 16,
    fontVariant: "all-petite-caps",
  },
  brightText: {
    color: "rgb(143, 235, 181)",
    marginTop: 0,
    marginBottom: 4,
    fontSize: 16,
    fontVariant: "all-petite-caps",
  },
  text: {
    width: "33%",
    textAlign: "center",
    color: "rgb(55, 62, 70)",
  },
  octaveTextRight: {
    "&:first-child": {
      marginLeft: -16,
    },
    "&:last-child": {
      marginLeft: -16,
    },
    marginLeft: -4,
    display: "inline-block",
    fontSize: "11px",
  },
  octaveTextLeft: {
    "&:first-child": {
      marginRight: -16,
    },
    "&:last-child": {
      marginRight: -16,
    },
    marginLeft: -4,
    display: "inline-block",
    fontSize: "11px",
  },
  switches: {},
  tuneKnobs: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: -77,
  },
  leftOsc: {
    display: "flex",
    flexDirection: "row",
  },
  osc: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 15,
  },
  rightOsc: {
    display: "flex",
    flexDirection: "row",
  },
  headertext: {
    color: "rgb(143, 235, 181)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 0,
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
    display: "inline-flex",
  },
  smallButton: {
    padding: 4,
    display: "inline-flex",
  },
  textContainer: {
    display: "flex",
  },
  ledContainer: {
    width: 20,
  },
  switchContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  switchLeft: {
    float: "right",
    paddingLeft: 5,
  },
  switchRight: {
    marginRight: 5,
    paddingRight: 5,
  },
  octaves: {
    display: "flex",
    flexDirection: "column",
  },
  glideSection: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    justifyContent: "space-between",
    marginTop: 5,
  },
  glideLeft: {
    backgroundColor: "rgb(143, 235, 181)",
    display: "flex",
    width: 126,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 16,
  },
  glideRight: {
    backgroundColor: "rgb(143, 235, 181)",
    display: "flex",
    width: 126,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
  },
  glideButton: {
    width: 93,
    marginTop: -12,
  },
  justifyMid: {
    display: "flex",
    alignItems: "center",
  },
  waveform: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  nomargin: {
    margin: 0,
  },
  offlabel: {
    width: 10,
    display: "inline-block",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  miniText: {
    fontSize: "8px",
    marginRight: 3,
  },
  rightPadding: {
    paddingRight: 8,
  },
}));
