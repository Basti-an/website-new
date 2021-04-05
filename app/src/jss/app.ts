import { Theme, makeStyles } from "@material-ui/core";
import Config from "../config";
import { getIsMobileOS } from "../utils";

const { hostUrl } = Config;

const isMobile = getIsMobileOS();

export const appStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    marginTop: 0,
    zIndex: 1,
    backgroundImage: isMobile
      ? `url("${hostUrl}/images/mobileBg.jpg")`
      : `url("${hostUrl}/images/mainBg.jpg")`,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    minHeight: "100vh",
    textAlign: "center",
  },
  titlebar: {
    transform: "translate3d(0,0,0)",
    backgroundColor: "rgba(42,42,42,0.5)",
    backdropFilter: "blur(28px)",
    color: theme.palette.primary.contrastText,
    zIndex: 10000,
    position: "fixed",
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    fontWeight: 300,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2) - 2,
    paddingTop: 64,
    height: "100%",
    position: "relative",
    zIndex: 1000,
  },
  headline: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: 300,
    fontSize: "18pt",
    color: "#fff",
  },
  grid: {
    maxWidth: 1800,
    marginRight: "auto",
    marginLeft: "auto",
  },
  links: {
    "&:visited": {
      color: "#fff",
    },
    listStyle: "none",
    marginBottom: "2rem",
    marginRight: "auto",
    marginLeft: "auto",
    // textDecoration: "none",
    fontWeight: 300,
    color: "#fff",
    borderRadius: "4px",
    padding: "0",
    marginTop: "2rem",
    fontSize: "16pt",
  },
  boxed: {
    backgroundColor: "initial",
    backdropFilter: "blur(18px)",
    borderRadius: "4px",
    padding: "1rem",
    fontWeight: 300,
    marginBottom: 16,
    marginTop: 8,
  },
  switch: { marginRight: 0, float: "right" },
}));
