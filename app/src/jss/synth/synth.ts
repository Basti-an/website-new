import { makeStyles } from "@material-ui/core";
import Config from "../../config";

const { hostUrl } = Config;

export const synthStyles = makeStyles({
  title: {
    color: "#fff",
    margin: "1rem auto",
  },
  synth: {
    fontSize: "1rem",
    webkitTouchCallout: "none",
    webkitUserSelect: "none",
    userSelect: "none",
  },
  link: {
    "&:visited": {
      color: "inherit",
    },
  },
  erebusBox: {
    boxSizing: "border-box",
    maxWidth: 775,
    marginLeft: "auto",
    marginRight: "auto",
    margin: "1rem 0",
    padding: "1rem",
    backgroundColor: "rgb(55, 62, 70)",
    border: "5px solid rgb(133, 225, 171)",
    borderRadius: "1rem",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  },

  error: {
    fontWeight: 500,
  },
  row: {
    display: "flex",
    "align-items": "flex-start",
    "justify-content": "flex-start",
    "flex-wrap": "wrap",
  },
  rowCenter: {
    "margin-right": "auto",
    "margin-left": "auto",
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    "flex-wrap": "wrap",
  },
  rowVertical: {
    display: "flex",
    "align-items": "center",
    "justify-content": "flex-start",
    "flex-wrap": "wrap",
  },
  column: {
    flexDirection: "column",
    display: "flex",
    "align-items": "flex-start",
    "justify-content": "center",
    "flex-wrap": "wrap",
  },
  namePlate: {
    flexDirection: "column",
    display: "flex",
  },
  "@media (max-width: 800px)": {
    namePlate: {
      display: "none",
    },
  },
  namePlateTitle: {
    color: "rgb(133, 225, 171)",
    fontSize: "80px",
    margin: "0",
    padding: "0 1rem",
    fontFamily: "opal",
    marginBottom: "-1rem",
  },
  namePlateSubTitle: {
    fontSize: "18px",
    fontWeight: 100,
    margin: "0 1rem",
    padding: "3px 1rem",
    color: "rgb(55, 62, 70)",
    borderRadius: 10,
    backgroundColor: "rgb(133, 225, 171)",
  },
  osc: {
    borderRadius: "1rem",
    border: "5px solid rgb(133, 225, 171)",
    borderStyle: "double",
    borderTopWidth: "medium",
    borderBottomWidth: "medium",
    marginLeft: 3,
  },
  keyboardContainer: {
    maxWidth: 775,
    margin: "auto",
    padding: "1rem",
    backgroundImage: `url('${hostUrl}/images/wood-texture-unsplash.jpg')`,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
    borderRadius: 12,
    boxSizing: "border-box",
  },
});
